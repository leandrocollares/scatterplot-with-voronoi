# Scatterplot with Voronoi

An interactive scatterplot implemented with D3.js version 4.13.0.
A Voronoi diagram is employed to make data exploration easier. 
The visualization builds on the previous [scatterplot](https://github.com/leandrocollares/scatterplot-with-tooltip) and uses some ideas from Peter Beshai's [blog](https://peterbeshai.com/scatterplot-in-d3-with-voronoi-interaction.html). 
  
## Getting started

* Clone or download the repository. 

* Run a local web server<sup>1</sup> so that the external data file can be loaded.

* Interact with the scatterplot in your web browser.

<sup>1</sup> If Python is installed on the computer, execute one of the following to run a web server locally on port 8000: 

* ```python -m SimpleHTTPServer 8000 ``` for Python 2.x
* ```python -m http.server 8000 ``` for Python 3.x

## Data sources

[United Nations Development Programme](http://hdr.undp.org/en/content/inequality-adjusted-human-development-index-ihdi) and [The Observatory of Economic Complexity](https://atlas.media.mit.edu/en/rankings/country/eci/).