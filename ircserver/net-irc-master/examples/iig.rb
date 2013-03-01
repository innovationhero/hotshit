#!/usr/bin/env ruby
# vim:encoding=UTF-8:
$KCODE = "u" unless defined? ::Encoding # json use this
=begin

# iig.rb

Identi.ca/Laconi.ca IRC gateway

## Launch

	$ ruby iig.rb

If you want to help:

	$ ruby iig.rb --help

## Configuration

Options specified by after IRC realname.

Configuration example for Tiarra <http://coderepos.org/share/wiki/Tiarra>.

	identica {
		host: localhost
		port: 16672
		name: username@example.com athack tid ratio=77:1:12 replies
		password: password on Identi.ca
		in-encoding: utf8
		out-encoding: utf8
	}

### athack

If `athack` client option specified,
all nick in join message is leading with @.

So if you complemente nicks (e.g. Irssi),
it's good for Identi.ca like reply command (@nick).

In this case, you will see torrent of join messages after connected,
because NAMES list can't send @ leading nick (it interpreted op.)

### tid[=<color>]

Apply ID to each message for make favorites by CTCP ACTION.

	/me fav ID [ID...]

<color> can be

	0  => white
	1  => black
	2  => blue         navy
	3  => green
	4  => red
	5  => brown        maroon
	6  => purple
	7  => orange       olive
	8  => yellow
	9  => lightgreen   lime
	10 => teal
	11 => lightcyan    cyan aqua
	12 => lightblue    royal
	13 => pink         lightpurple fuchsia
	14 => grey
	15 => lightgrey    silver

### jabber=<jid>:<pass>

If `jabber=<jid>:<pass>` option specified,
use jabber to get friends timeline.

You must setup im notifing settings in the site and
install "xmpp4r-simple" gem.

	$ sudo gem install xmpp4r-simple

Be careful for managing password.

### alwaysim

Use IM instead of any APIs (e.g. post)

### ratio=<timeline>:<friends>

### replies[=<ratio>]

### maxlimit=<hourly limit>

### checkrls=<interval seconds>

## Feed

<http://coderepos.org/share/log/lang/ruby/net-irc/trunk/examples/iig.rb?limit=100&mode=stop_on_copy&format=rss>

## License

Ruby's by cho45

=end

$LOAD_PATH << "lib" << "../lib"

require "rubygems"
require "net/irc"
require "net/http"
require "uri"
require "socket"
require "time"
require "logger"
require "yaml"
require "pathname"
require "cgi"
require "json"

class IdenticaIrcGateway < Net::IRC::Server::Session
	def server_name;    "identicagw"                 end
	def server_version; "0.0.0"                      end
	def main_channel;   "#Identi.ca"                 end
	def api_base;       URI("http://identi.ca/api/") end
	def api_source;     "iig.rb"                     end
	def jabber_bot_id;  "update@identi.ca"           end
	def hourly_limit;   100                          end

	class APIFailed < StandardError; end

	def initialize(*args)
		super
		@groups     = {}
		@channels   = [] # joined channels (groups)
		@user_agent = "#{self.class}/#{server_version} (#{File.basename(__FILE__)})"
		@config     = Pathname.new(ENV["HOME"]) + ".iig"
		load_config
	end

	def on_user(m)
		super
		post @prefix, JOIN, main_channel
		post server_name, MODE, main_channel, "+o", @prefix.nick

		@real, *@opts = @opts.name || @real.split(/\s+/)
		@opts = @opts.inject({}) {|r,i|
			key, value = i.split("=")
			r.update(key => value)
		}
		@tmap = TypableMap.new

		if @opts["jabber"]
			jid, pass = @opts["jabber"].split(":", 2)
			@opts["jabber"].replace("jabber=#{jid}:********")
			if jabber_bot_id
				begin
					require "xmpp4r-simple"
					start_jabber(jid, pass)
				rescue LoadError
					log "Failed to start Jabber."
					log 'Installl "xmpp4r-simple" gem or check your ID/pass.'
					finish
				end
			else
				@opts.delete("jabber")
				log "This gateway does not support Jabber bot."
			end
		end

		log "Client Options: #{@opts.inspect}"
		@log.info "Client Options: #{@opts.inspect}"

		@hourly_limit = hourly_limit
		@ratio = Struct.new(:timeline, :friends, :replies).new(*(@opts["ratio"] || "10:3").split(":").map {|ratio| ratio.to_f })
		@ratio[:replies] = @opts.key?("replies") ? (@opts["replies"] || 5).to_f : 0.0

		footing = @ratio.inject {|sum, ratio| sum + ratio }

		@ratio.each_pair {|m, v| @ratio[m] = v / footing }

		@timeline = []
		@check_friends_thread = Thread.start do
			loop do
				begin
					check_friends
				rescue APIFailed => e
					@log.error e.inspect
				rescue Exception => e
					@log.error e.inspect
					e.backtrace.each do |l|
						@log.error "\t#{l}"
					end
				end
				sleep freq(@ratio[:friends])
			end
		end

		return if @opts["jabber"]

		sleep 3
		@check_timeline_thread = Thread.start do
			loop do
				begin
					check_timeline
					# check_direct_messages
				rescue APIFailed => e
					@log.error e.inspect
				rescue Exception => e
					@log.error e.inspect
					e.backtrace.each do |l|
						@log.error "\t#{l}"
					end
				end
				sleep freq(@ratio[:timeline])
			end
		end

		return unless @opts.key?("replies")

		sleep 10
		@check_replies_thread = Thread.start do
			loop do
				begin
					check_replies
				rescue APIFailed => e
					@log.error e.inspect
				rescue Exception => e
					@log.error e.inspect
					e.backtrace.each do |l|
						@log.error "\t#{l}"
					end
				end
				sleep freq(@ratio[:replies])
			end
		end
	end

	def on_disconnected
		@check_friends_thread.kill  rescue nil
		@check_replies_thread.kill  rescue nil
		@check_timeline_thread.kill rescue nil
		@im_thread.kill             rescue nil
		@im.disconnect              rescue nil
	end

	def on_privmsg(m)
		return m.ctcps.each {|ctcp| on_ctcp(m[0], ctcp) } if m.ctcp?
		retry_count = 3
		ret = nil
		target, message = *m.params
		begin
			if target =~ /^#/
				if @opts.key?("alwaysim") && @im && @im.connected? # in jabber mode, using jabber post
					ret = @im.deliver(jabber_bot_id, message)
					post "#{nick}!#{nick}@#{api_base.host}", TOPIC, main_channel, untinyurl(message)
				else
					ret = api("statuses/update", {"status" => message})
				end
			else
				# direct message
				ret = api("direct_messages/new", {"user" => target, "text" => message})
			end
			raise APIFailed, "API failed" unless ret
			log "Status Updated"
		rescue => e
			@log.error [retry_count, e.inspect].inspect
			if retry_count > 0
				retry_count -= 1
				@log.debug "Retry to setting status..."
				retry
			else
				log "Some Error Happened on Sending #{message}. #{e}"
			end
		end
	end

	def on_ctcp(target, message)
		_, command, *args = message.split(/\s+/)
		case command
		when "list", "ls"
			nick = args[0]
			unless (1..200).include?(count = args[1].to_i)
				count = 20
			end
			@log.debug([ nick, message ])
			res = api("statuses/user_timeline", {"id" => nick, "count" => "#{count}"}).reverse_each do |s|
				@log.debug(s)
				post nick, NOTICE, main_channel, "#{generate_status_message(s)}"
			end
			unless res
				post server_name, ERR_NOSUCHNICK, nick, "No such nick/channel"
			end
		when /^(un)?fav(?:ou?rite)?$/
			method, pfx = $1.nil? ? ["create", "F"] : ["destroy", "Unf"]
			args.each_with_index do |tid, i|
				st = @tmap[tid]
				if st
					sleep 1 if i > 0
					res = api("favorites/#{method}/#{st["id"]}")
					post server_name, NOTICE, main_channel, "#{pfx}av: #{res["user"]["screen_name"]}: #{res["text"]}"
				else
					post server_name, NOTICE, main_channel, "No such ID #{tid}"
				end
			end
		when "link", "ln"
			args.each do |tid|
				st = @tmap[tid]
				if st
					st["link"] = "http://#{api_base.host}/notice/#{st["id"]}" unless st["link"]
					post server_name, NOTICE, main_channel, st["link"]
				else
					post server_name, NOTICE, main_channel, "No such ID #{tid}"
				end
			end
#		when /^ratios?$/
#			if args[1].nil? ||
#			   @opts.key?("replies") && args[2].nil?
#				return post server_name, NOTICE, main_channel, "/me ratios <timeline> <frends>[ <replies>]"
#			end
#			ratios = args.map {|ratio| ratio.to_f }
#			if ratios.any? {|ratio| ratio <= 0.0 }
#				return post server_name, NOTICE, main_channel, "Ratios must be greater than 0."
#			end
#			footing = ratios.inject {|sum, ratio| sum + ratio }
#			@ratio[:timeline] = ratios[0]
#			@ratio[:friends]  = ratios[1]
#			@ratio[:replies]  = ratios[2] || 0.0
#			@ratio.each_pair {|m, v| @ratio[m] = v / footing }
#			intervals = @ratio.map {|ratio| freq ratio }
#			post server_name, NOTICE, main_channel, "Intervals: #{intervals.join(", ")}"
		when /^(?:de(?:stroy|l(?:ete)?)|remove|miss)$/
			args.each_with_index do |tid, i|
				st = @tmap[tid]
				if st
					sleep 1 if i > 0
					res = api("statuses/destroy/#{st["id"]}")
					post server_name, NOTICE, main_channel, "Destroyed: #{res["text"]}"
				else
					post server_name, NOTICE, main_channel, "No such ID #{tid}"
				end
			end
		when "in", "location"
			location = args.join(" ")
			api("account/update_location", {"location" => location})
			location = location.empty? ? "nowhere" : "in #{location}"
			post server_name, NOTICE, main_channel, "You are #{location} now."
		end
	rescue APIFailed => e
		log e.inspect
	end; private :on_ctcp

	def on_whois(m)
		nick = m.params[0]
		f = (@friends || []).find {|i| i["screen_name"] == nick }
		if f
			post server_name, RPL_WHOISUSER,   @nick, nick, nick, api_base.host, "*", "#{f["name"]} / #{f["description"]}"
			post server_name, RPL_WHOISSERVER, @nick, nick, api_base.host, api_base.to_s
			post server_name, RPL_WHOISIDLE,   @nick, nick, "0", "seconds idle"
			post server_name, RPL_ENDOFWHOIS,  @nick, nick, "End of WHOIS list"
		else
			post server_name, ERR_NOSUCHNICK, nick, "No such nick/channel"
		end
	end

	def on_who(m)
		channel = m.params[0]
		case
		when channel == main_channel
			#     "<channel> <user> <host> <server> <nick>
			#         ( "H" / "G" > ["*"] [ ( "@" / "+" ) ]
			#             :<hopcount> <real name>"
			@friends.each do |f|
				user = nick = f["screen_name"]
				host = serv = api_base.host
				real = f["name"]
				post server_name, RPL_WHOREPLY, @nick, channel, user, host, serv, nick, "H*@", "0 #{real}"
			end
			post server_name, RPL_ENDOFWHO, @nick, channel
		when @groups.key?(channel)
			@groups[channel].each do |name|
				f = @friends.find {|i| i["screen_name"] == name }
				user = nick = f["screen_name"]
				host = serv = api_base.host
				real = f["name"]
				post server_name, RPL_WHOREPLY, @nick, channel, user, host, serv, nick, "H*@", "0 #{real}"
			end
			post server_name, RPL_ENDOFWHO, @nick, channel
		else
			post server_name, ERR_NOSUCHNICK, @nick, nick, "No such nick/channel"
		end
	end

	def on_join(m)
		channels = m.params[0].split(/\s*,\s*/)
		channels.each do |channel|
			next if channel == main_channel

			@channels << channel
			@channels.uniq!
			post "#{@nick}!#{@nick}@#{api_base.host}", JOIN, channel
			post server_name, MODE, channel, "+o", @nick
			save_config
		end
	end

	def on_part(m)
		channel = m.params[0]
		return if channel == main_channel

		@channels.delete(channel)
		post @nick, PART, channel, "Ignore group #{channel}, but setting is alive yet."
	end

	def on_invite(m)
		nick, channel = *m.params
		return if channel == main_channel

		if (@friends || []).find {|i| i["screen_name"] == nick }
			((@groups[channel] ||= []) << nick).uniq!
			post "#{nick}!#{nick}@#{api_base.host}", JOIN, channel
			post server_name, MODE, channel, "+o", nick
			save_config
		else
			post ERR_NOSUCHNICK, nil, nick, "No such nick/channel"
		end
	end

	def on_kick(m)
		channel, nick, mes = *m.params
		return if channel == main_channel

		if (@friends || []).find {|i| i["screen_name"] == nick }
			(@groups[channel] ||= []).delete(nick)
			post nick, PART, channel
			save_config
		else
			post ERR_NOSUCHNICK, nil, nick, "No such nick/channel"
		end
	end

	private
	def check_timeline
		api("statuses/friends_timeline", {:count => "117"}).reverse_each do |s|
			id = s["id"]
			next if id.nil? || @timeline.include?(id)

			@timeline << id
			nick = s["user"]["screen_name"]
			mesg = generate_status_message(s)
			tid  = @tmap.push(s)

			@log.debug [id, nick, mesg]
			if nick == @nick # 自分のときは TOPIC に
				post "#{nick}!#{nick}@#{api_base.host}", TOPIC, main_channel, untinyurl(mesg)
			else
				if @opts.key?("tid")
					mesg = "%s \x03%s [%s]" % [mesg, @opts["tid"] || 10, tid]
				end
				message(nick, main_channel, mesg)
			end
			@groups.each do |channel, members|
				next unless members.include?(nick)
				if @opts.key?("tid")
					mesg = "%s \x03%s [%s]" % [mesg, @opts["tid"] || 10, tid]
				end
				message(nick, channel, mesg)
			end
		end
		@log.debug "@timeline.size = #{@timeline.size}"
		@timeline = @timeline.last(117)
	end

	def generate_status_message(status)
		s = status
		mesg = s["text"]
		@log.debug(mesg)

		# time = Time.parse(s["created_at"]) rescue Time.now
		m = {"&quot;" => "\"", "&lt;" => "<", "&gt;" => ">", "&amp;" => "&", "\n" => " "}
		mesg.gsub!(/#{m.keys.join("|")}/) { m[$&] }
		mesg
	end

	def check_replies
		time = @prev_time_r || Time.now
		@prev_time_r = Time.now
		api("statuses/replies").reverse_each do |s|
			id = s["id"]
			next if id.nil? || @timeline.include?(id)

			created_at = Time.parse(s["created_at"]) rescue next
			next if created_at < time

			nick = s["user"]["screen_name"]
			mesg = generate_status_message(s)
			tid  = @tmap.push(s)

			@log.debug [id, nick, mesg]
			if @opts.key?("tid")
				mesg = "%s \x03%s [%s]" % [mesg, @opts["tid"] || 10, tid]
			end
			message nick, main_channel, mesg
		end
	end

	def check_direct_messages
		time = @prev_time_d || Time.now
		@prev_time_d = Time.now
		api("direct_messages", {"since" => time.httpdate}).reverse_each do |s|
			nick = s["sender_screen_name"]
			mesg = s["text"]
			time = Time.parse(s["created_at"])
			@log.debug [nick, mesg, time].inspect
			message(nick, @nick, mesg)
		end
	end

	def check_friends
		first = true unless @friends
		@friends ||= []
		friends = api("statuses/friends")
		if first && !@opts.key?("athack")
			@friends = friends
			post server_name, RPL_NAMREPLY,   @nick, "=", main_channel, @friends.map{|i| "@#{i["screen_name"]}" }.join(" ")
			post server_name, RPL_ENDOFNAMES, @nick, main_channel, "End of NAMES list"
		else
			prv_friends = @friends.map {|i| i["screen_name"] }
			now_friends = friends.map {|i| i["screen_name"] }

			# Twitter API bug?
			return if !first && (now_friends.length - prv_friends.length).abs > 10

			(now_friends - prv_friends).each do |join|
				join = "@#{join}" if @opts.key?("athack")
				post "#{join}!#{join}@#{api_base.host}", JOIN, main_channel
			end
			(prv_friends - now_friends).each do |part|
				part = "@#{part}" if @opts.key?("athack")
				post "#{part}!#{part}@#{api_base.host}", PART, main_channel, ""
			end
			@friends = friends
		end
	end

	def check_downtime
		@prev_downtime ||= nil
		schedule = api("help/downtime_schedule", {}, {:avoid_error => true})["error"]
		if @prev_downtime != schedule && @prev_downtime = schedule
			msg  = schedule.gsub(%r{[\r\n]|<style(?:\s[^>]*)?>.*?</style\s*>}m, "")
			uris = URI.extract(msg)
			uris.each do |uri|
				msg << " #{uri}"
			end
			msg.gsub!(/<[^>]+>/, "")
			log "\002\037#{msg}\017"
			# TODO: sleeping for the downtime
		end
	end

	def freq(ratio)
		max   = (@opts["maxlimit"] || 100).to_i
		limit = @hourly_limit < max ? @hourly_limit : max
		f     = 3600 / (limit * ratio).round
		@log.debug "Frequency: #{f}"
		f
	end

	def start_jabber(jid, pass)
		@log.info "Logging-in with #{jid} -> jabber_bot_id: #{jabber_bot_id}"
		@im = Jabber::Simple.new(jid, pass)
		@im.add(jabber_bot_id)
		@im_thread = Thread.start do
			loop do
				begin
					@im.received_messages.each do |msg|
						@log.debug [msg.from, msg.body]
						if msg.from.strip == jabber_bot_id
							# Twitter -> 'id: msg'
							body = msg.body.sub(/^(.+?)(?:\((.+?)\))?: /, "")
							if Regexp.last_match
								nick, id = Regexp.last_match.captures
								body = CGI.unescapeHTML(body)
								message(id || nick, main_channel, body)
							end
						end
					end
				rescue Exception => e
					@log.error "Error on Jabber loop: #{e.inspect}"
					e.backtrace.each do |l|
						@log.error "\t#{l}"
					end
				end
				sleep 1
			end
		end
	end

	def save_config
		config = {
			:channels => @channels,
			:groups   => @groups,
		}
		@config.open("w") do |f|
			YAML.dump(config, f)
		end
	end

	def load_config
		@config.open do |f|
			config = YAML.load(f)
			@channels = config[:channels]
			@groups   = config[:groups]
		end
	rescue Errno::ENOENT
	end

	def require_post?(path)
		[
			%r{^statuses/(?:update$|destroy/)},
			"direct_messages/new",
			"account/update_location",
			%r{^favorites/},
		].any? {|i| i === path }
	end

	def api(path, q = {}, opt = {})
		ret     = {}
		headers = {"User-Agent" => @user_agent}
		headers["If-Modified-Since"] = q["since"] if q.key?("since")

		q["source"] ||= api_source
		q = q.inject([]) {|r,(k,v)| v ? r << "#{k}=#{URI.escape(v, /[^-.!~*'()\w]/n)}" : r }.join("&")

		path = path.sub(%r{^/+}, "")
		uri  = api_base.dup
		uri.path += "#{path}.json"
		if require_post? path
			req = Net::HTTP::Post.new(uri.request_uri, headers)
			req.body = q
		else
			uri.query = q
			req = Net::HTTP::Get.new(uri.request_uri, headers)
		end
		req.basic_auth(@real, @pass)
		@log.debug uri.inspect

		ret = Net::HTTP.start(uri.host, uri.port) {|http| http.request(req) }
		case ret
		when Net::HTTPOK # 200
			ret = JSON.parse(ret.body.gsub(/'(y(?:es)?|no?|true|false|null)'/, '"\1"'))
			if ret.kind_of?(Hash) && !opt[:avoid_error] && ret["error"]
				raise APIFailed, "Server Returned Error: #{ret["error"]}"
			end
			ret
		when Net::HTTPNotModified # 304
			[]
		when Net::HTTPBadRequest # 400
			# exceeded the rate limitation
			raise APIFailed, "#{ret.code}: #{ret.message}"
		else
			raise APIFailed, "Server Returned #{ret.code} #{ret.message}"
		end
	rescue Errno::ETIMEDOUT, JSON::ParserError, IOError, Timeout::Error, Errno::ECONNRESET => e
		raise APIFailed, e.inspect
	end

	def message(sender, target, str)
#		str.gsub!(/&#(x)?([0-9a-f]+);/i) do
#			[$1 ? $2.hex : $2.to_i].pack("U")
#		end
		str    = untinyurl(str)
		sender = "#{sender}!#{sender}@#{api_base.host}"
		post sender, PRIVMSG, target, str
	end

	def log(str)
		str.gsub!(/\r\n|[\r\n]/, " ")
		post server_name, NOTICE, main_channel, str
	end

	def untinyurl(text)
		text.gsub(%r|http://(preview\.)?tinyurl\.com/[0-9a-z=]+|i) {|m|
			uri = URI(m)
			uri.host = uri.host.sub($1, "") if $1
			Net::HTTP.start(uri.host, uri.port) {|http|
				http.open_timeout = 3
				begin
					http.head(uri.request_uri, {"User-Agent" => @user_agent})["Location"] || m
				rescue Timeout::Error
					m
				end
			}
		}
	end

	class TypableMap < Hash
		Roman = %w[
			k g ky gy s z sh j t d ch n ny h b p hy by py m my y r ry w v q
		].unshift("").map do |consonant|
			case consonant
			when "y", /\A.{2}/ then %w|a u o|
			when "q"           then %w|a i e o|
			else                    %w|a i u e o|
			end.map {|vowel| "#{consonant}#{vowel}" }
		end.flatten

		def initialize(size = 1)
			@seq  = Roman
			@n    = 0
			@size = size
		end

		def generate(n)
			ret = []
			begin
				n, r = n.divmod(@seq.size)
				ret << @seq[r]
			end while n > 0
			ret.reverse.join
		end

		def push(obj)
			id = generate(@n)
			self[id] = obj
			@n += 1
			@n %= @seq.size ** @size
			id
		end
		alias << push

		def clear
			@n = 0
			super
		end

		private :[]=
		undef update, merge, merge!, replace
	end


end

if __FILE__ == $0
	require "optparse"

	opts = {
		:port  => 16672,
		:host  => "localhost",
		:log   => nil,
		:debug => false,
		:foreground => false,
	}

	OptionParser.new do |parser|
		parser.instance_eval do
			self.banner = <<-EOB.gsub(/^\t+/, "")
				Usage: #{$0} [opts]

			EOB

			separator ""

			separator "Options:"
			on("-p", "--port [PORT=#{opts[:port]}]", "port number to listen") do |port|
				opts[:port] = port
			end

			on("-h", "--host [HOST=#{opts[:host]}]", "host name or IP address to listen") do |host|
				opts[:host] = host
			end

			on("-l", "--log LOG", "log file") do |log|
				opts[:log] = log
			end

			on("--debug", "Enable debug mode") do |debug|
				opts[:log]   = $stdout
				opts[:debug] = true
			end

			on("-f", "--foreground", "run foreground") do |foreground|
				opts[:log]        = $stdout
				opts[:foreground] = true
			end

			on("-n", "--name [user name or email address]") do |name|
				opts[:name] = name
			end

			parse!(ARGV)
		end
	end

	opts[:logger] = Logger.new(opts[:log], "daily")
	opts[:logger].level = opts[:debug] ? Logger::DEBUG : Logger::INFO

	#def daemonize(foreground = false)
	#	trap("SIGINT")  { exit! 0 }
	#	trap("SIGTERM") { exit! 0 }
	#	trap("SIGHUP")  { exit! 0 }
	#	return yield if $DEBUG || foreground
	#	Process.fork do
	#		Process.setsid
	#		Dir.chdir "/"
	#		File.open("/dev/null") {|f|
	#			STDIN.reopen  f
	#			STDOUT.reopen f
	#			STDERR.reopen f
	#		}
	#		yield
	#	end
	#	exit! 0
	#end

	#daemonize(opts[:debug] || opts[:foreground]) do
		Net::IRC::Server.new(opts[:host], opts[:port], IdenticaIrcGateway, opts).start
	#end
end

# Local Variables:
# coding: utf-8
# End:
