

var i, n=1000000, xpos=[], ypos=[], dist, count=0;
for(i=0;i<n;i++){
    xpos.push( Math.random() );
    ypos.push( Math.random() );

    dist = Math.sqrt( xpos[i]*xpos[i] + ypos[i]*ypos[i] );

    if(dist<=1){
        count++;
    }
}

var pi = 4 * ( count / n );
console.log(pi);