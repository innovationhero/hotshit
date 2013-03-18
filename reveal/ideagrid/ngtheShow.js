/*                                                                                                            
 _   _          __ _                    _     
| |_| |__   ___/ _\ |__   _____      __(_)___ 
| __| '_ \ / _ \ \| '_ \ / _ \ \ /\ / /| / __|
| |_| | | |  __/\ \ | | | (_) \ V  V / | \__ \
 \__|_| |_|\___\__/_| |_|\___/ \_/\_(_)/ |___/
                                     |__/    
 
theShow.js is an intutive javascript UI library that uses genatic algorithms to evolve UI content aiming to provide the user with a personlaized UX for hisliking.
*/
/* this is the angular directive that will be theShow.js core that will utilize the api.js */


/// theShowDirective that uses the api.js and populate it with dump json data from an ngJsonService, keeping DOM manipulation resticted in the Directive only, no DOM maniupluation is allowed outside of the directives EVER!

// theShow.start(theShowOpts); // layoutOptions{layoutID,diminsionsObj{x,y}, layoutDataSource, }
// block.mutate(mutateOptions);
// block.fitness = newValue;


// after document load complete 
// start theShow

//var ideaShow = theShow.start(opts);


// json data loaded from some AngularService with 3 shows, each got its diff id and other data

jsonDS =[{

theshow {
	block:{
		frag: {data,data,data,data}		
		frag: {data,data,data,data}	
		frag: {data,data,data,data}	
		frag: {data,data,data,data}
        }
	block:{     }
	block:{     }
}
theshow{

	block:{     }
	block:{     }
	block:{     }
}
theshow{

	block:{     }
	block:{     }
	block:{     }
}

}]

// this module will apply angular $scope, two-way binding magic to UI interactions

// Consider providing 3 directive to help angular use its magic at runtime 

// theShow directive
// Block directive 
// frag directive 


theShow.config = {
		ShowId = 1, // incase we are using more than one show in the same webapplication
		YAxis = 10,
		XAxis =20,
		ds = 'json from datasource',
		blocksConfig = 'json of all blocks from datasource', // or extract			
		// all layout options
}

theShow.start : {
		.fetchBlocks() // will return from the theShowConfig.ds 
		.showBlocks()  // display all blocks on webpage
		.hideBlocks() // hide all blocks onthe webpage
		.fetchNextBlocks() // after theShow.start.save, get a new pool of blocks


		.shuffleFintess() // shuffle the fitness values of all the blocks
		.shuffleBlocks()
		.shuffleFrags()

		// or blockConfig1, blockConfig2??
		.combine(block1,block2)
		.seperate(block1, block2)
		.create(block(blockConfig)
		.destory(block(blockConfig)
		
		

		.animateGA() // runs client-side UI genatic algorithm for the user where blocks gets combined, seperated, shuffle fitness, etc.
		.freezeGA()  // freezes theShow GA giving a user chance to input his opinon, and perhaps save the current state 
		
		.save() // returns a json of all the current states of theShow to be stored safely in the database 
		.flush() // emty theShow from all the blocks
		
		.block(blockConfig).incrFitness()
		.block(blockConfig).decrFitness()
		.block(blockConfig),relocate()
} 	 
