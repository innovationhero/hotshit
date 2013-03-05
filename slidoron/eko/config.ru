# The static content rooted in the current working directory
# Dir.pwd =&gt; http://0.0.0.0:3000/
#
#root=Dir.pwd
#puts ">>> Serving: #{root}"
#run Rack::Directory.new("#{root}")
use Rack::Static, 
  :urls => ["/images", "/js", "/css"],
  :root => "public"

run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('mydemo.html', File::RDONLY)
  ]
}
# thin -R static.ru start

