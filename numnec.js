// Returns an array consisting of of all and only the number necklaces in specified base, in ascending order.
function allNecklaces( base ) {
	var pairs = [],
		necklaces = [],
        lengths = [];


	// Initialize the pairs 2d array.
	for ( var i = 0; i < base; i++ ) {
  		pairs[i] = [];
  	}

    // Initialize the lengths array for special case of (0)
    //lengths[1] = 1;

	// For each possible pair in base base,
	for ( var i = 0; i < base; i++ ) {
    	for ( var j = 0; j < base; j++ ) {
    		// If we haven't seen this pair in any necklace yet,
    		if ( ! pairs[i][j] ) {
				var n = [ i, j ],
        			k = 2;
        		// Create a number necklace starting with this pair.
 				do {
 					// Current element is the sum of previous two elements mod base.
	  				n[k] = (n[k-2] + n[k-1]) % base;
	  				// Mark the current pair as 'seen'.
   		      		pairs[ n[k-2] ][ n[k-1] ] = 1;
  					k++;
  				// Continue to add elements to the necklace until we're back where we started.
  				} while ( ! ( n[k-2] == i && n[k-1] == j ) );
  				// Pop off the last two elements for savings.
  				n.pop();
  				n.pop();
  				// Push created necklace onto the necklaces array.
		        necklaces.push( n );
                // Update lengths array.
                if ( lengths[ n.length ] ) {
                   lengths[ n.length ]++;
                }
                else {
                    lengths[ n.length ] = 1;
                }
      		}
    	}
	}

    // Sort necklaces by period

    necklaces.sort( (a, b) => a.length - b.length );
  	return { necklaces: necklaces, lengths: lengths };
}

// Override the default toString method on arrays to output custom HTML.
Array.prototype.toString = function() {
    var s = '';
    for ( var i = 0; i < this.length; i++ ) {
        s += "<span class='bead-wrapper'><span class='bead'>" + this[i] + "</span></span>";
    }
    return s;
}

// Polyfill to return current time with microsecond accuracy for Chrome and Firefox and millisecond accuracy for Safari.
function currentTime() {
    return 'performance' in window ? performance.now() : new Date().getTime()
}

// Write all number necklaces for a given base to the HTML document.
function displayAllNecklaces( b ) {
    // time before calculating the necklaces
    var startTime = currentTime(),
        necklacesAndLengths = allNecklaces( b ),
        // necklaces is the array of all necklaces of base b, in ascending order 
        necklaces = necklacesAndLengths.necklaces,
        // lengths is a array giving the number of necklaces of each given length
        lengths = necklacesAndLengths.lengths,
        // time after calculating the necklaces
        endTime = currentTime(),

    // Table header
    h = "<table id='results-table'><tr><th colspan='2'>All " + necklaces.length + " number " +
        ( necklaces.length != 1 ? "necklaces" : "necklace" ) + " for modulus " + b + ":</th></tr>";

    // Print the summary
    h += "<tr><td colspan='2'>";
    for ( var i = 0; i < lengths.length; i++) {
        if ( lengths[i] >= 0 ) {
            h += lengths[i] + ( lengths[i] != 1 ? " necklaces" : " necklace" ) + " of period " + i + "<br>\n";
        }
    }
    h +=  "</td></tr>";
                
    // For each necklace in the necklaces array,
    for ( var i = 0; i < necklaces.length; i++) {
        var n = necklaces[i];
        // Write the necklace length and beads to the HTML document.
        h += "<tr><td>" + n.length + "</td><td>" + n + "</td></tr>\n";
    }

    // Write the table footer including time elapsed.
    h += "<tr><td colspan='2'>Time elapsed: " + ( Math.round( ( endTime - startTime ) * 1000 ) / 1000 ) + "ms.\n";
    h += "</table>\n"
    // Set the results selement's innerHTML to our table.
    document.getElementById( 'results' ).innerHTML = h;
}

// When page is loaded,
window.onload = function() {
    // Set the submit function for the form.
    document.getElementById( 'num-nec-form' ).onsubmit = function() {
        // b is the value of the text input element 'base'
        var b = document.getElementById( 'base').value - 0;
        // If b is a positive integer,
        if ( b % 1 === 0 && b > 0 ) {
            // Calculate all necklaces of base b.
            displayAllNecklaces( b );
        }
        else {
            // Otherwise throw up an alert message.
            alert( "Please enter a positive integer." );
        }
    }
}