/*

Ant1k Attack 🐜 by Frank Force

Ants are invading! Click to squish them.
Made by Frank Force for JS1024 2025
https://js1024.fun/demos/2025/11/readme

*/

'use strict';

// js1024 shim
const a = document.body.appendChild(document.createElement('canvas'));
const c = a.getContext("2d");
a.width = innerWidth
a.height = innerHeight;
document.body.style='margin:0;cursor:grab';

///////////////////////////////////////////////////////////////////////////////
/*
// Ant1k Attack 🐜 by Frank Force - 1020B!
for(_='a.~~r__*(^_/4,^ZMath.Y*YcosX),W-g/6WV-I/6,U(n=p=L100KYrandom()J*JHH,Gt.FWFEFgD(FBonA~a@^J+1)/--;)g=;gfor(3u(m.map(~y50Ysintyle)}(~x-h.x,99J<.5?-:&&9u(,-0,9))(@)*(g-1.4=>{  ~heightfill2H-1Ba+=.03*()E~width~gYhypot-h.y)<15Ba=FbeginPathBBellipse(~xu=(a=h=r=1)=>FS=c.S=`hsl(${a}%,${h}%,`+r,v=(a,t) .2W~g,+Z.5V^1.3V@,Wu(W,,_/.6,_/15,@+(2*g+~d/13W);59W-_*W+_X)-Zg-1?.4:.2W^g?.8:.4W@,,w=()    m.push({x:++n%2?H:+5y:n%2?+:Gr:25<n?5+6H:7+3Gg:J+1,a:d:0};~before(r=~clAeNode(~s.positiA="absolute")Wt=r.getCAtext`2d`,h=;hl=-15GI=9;IuLM=l-3*IERect(*gU*hU91+I,91+I);m=[],w(WAmousedown=h a  if(2*_){~++M,K==++pL0Wp?==p?K:2:1n<|==p&n<Kw();220G.3W+^W+^W2,7,9G);v(a,t1(~3H+2,@=Yatan2h.y-)+,setInterval(()   +=t DBx+=D*y-=DXd+=D-=2<D.002,Fx<-+33Ex>+-33Ey<-+22Ey>+Wv(t,c)Wc.fAt="6em cursive",9*gWpc.Text(M,29+g,+g,16)';G=/[^ -?CIM-T[\]`-}]/.exec(_);)with(_.split(G))_=join(shift());eval(_)
*/
///////////////////////////////////////////////////////////////////////////////

// constants (will be auto replace in minified)
const MAX_ANT_COUNT = 100;
const HALF_ANT_COUNT = MAX_ANT_COUNT/2|0;
const QUART_ANT_COUNT = MAX_ANT_COUNT/4|0;

// locals (remove declaration from minified)
let i, j, k, l,

// globals defined below (remove declaration from minified)
objects, objectCount, score, totalScore, canvasBack, contextBack,

// game stuff
hsl = (s=0, l=0, a=1)=> contextBack.fillStyle = c.fillStyle = `hsl(0,${s}%,${l}%,${a}`,

drawAnt = (p, context)=>
{
    for(i=3; i--;)
    {
        // shadow
        hsl(0, 0, .2);
        p.v && context.beginPath(context.fill(context.ellipse(
            p.x, p.y+p.r/4, 
            p.r*(.5-i/6), p.r*(1.3-i/6), 
            p.a, 0, 9)));

        // legs
        hsl();
        context.beginPath(context.fill(context.ellipse(
            p.x, p.y, 
            p.r/.6, p.r/15, 
            p.a+Math.sin(i*2+p.d/13), 0, 9)));
    }
    // body/head
    for(i=3; i--;)
    {
        hsl(50, 9);
        context.beginPath(context.fill(context.ellipse(
            p.x-p.r*Math.sin(p.a)*(i-1.4), p.y+p.r*(Math.cos(p.a)*(i-1.4))-p.r/4, 
            p.r*(i-1?.4:.2), p.r*(i?.8:.4), 
            p.a, 0, 9)));
    }
},

// spawn object
spawnObject = ()=>
{
    objects.push(
    {
        x: ++objectCount%2 ? a.width*Math.random() : Math.random() < .5 ? -50 : a.width + 50,
        y: objectCount%2 ? Math.random() < .5 ? -50 : a.height + 50 : a.height*Math.random(),
        r:  objectCount > QUART_ANT_COUNT ? 
            5+Math.random()*6 : // more size variance
            7+Math.random()*3, // normal enemy
        v: Math.random()+1,
        a: 0,
        d: 0
    });
},

// main game loop
update = ()=>
{
    // clear canvas
    a.width += 0;

    // update objects
    objects.map(p=>
    {
        if (p.v)
        {
            // move object
            p.x += p.v * Math.sin(p.a += (Math.random()*2-1)*.03); // move and wobble
            p.y -= p.v * Math.cos(p.a += (Math.random()*2-1)*.03); // move and wobble
            p.d += p.v -= p.v > 2 && .002; // slow down

            // bounce off walls
            if (p.x < -15)
                p.a = Math.random()*2-1 + 33;
            if (p.x > a.width+15)
                p.a = Math.random()*2-1 - 33;
            if (p.y < -15)
                p.a = Math.random()*2-1 + 22;
            if (p.y > a.height+15)
                p.a = Math.random()*2-1;

            // draw object
            drawAnt(p, c);
        }
    });

    // draw score
    c.font = '6em cursive';
    for(i=9; i--;)
    {
        hsl(99, 50-i*9);
        score && c.fillText(totalScore, 29+i, 99+i);
    }
}

///////////////////////////////////////////////////////////////////////////////

// setup background canvas
a.before(canvasBack = a.cloneNode(a.style.position = 'absolute'));
contextBack = canvasBack.getContext("2d");

// draw background
for(i=99; i--;)
for(j=99; j--;)
for(l=99-Math.random()*15, k=9; k--;)
{
    // set color and init score
    hsl(objectCount = score = totalScore = 0, l - k*3);
    // draw background tiles
    contextBack.fillRect(i*99-k/6, j*99-k/6, 91+k, 91+k);
}

// int global variables
objects = [];

// spawn ants
//for(i=50;i--;)//test spawn
spawnObject();

onmousedown = e=>
{
    // check for ant click
    objects.map(p=>
    {
        // check if near ant
        if (p.v && Math.hypot(p.x - e.x, p.y - e.y) < p.r*2)
        {
            // smash ant
            p.v = 0;
            ++totalScore; // increase score
            if (++score == MAX_ANT_COUNT) 
                objectCount = score = 0; // restart game

            // spawn more ants
            for(i = score ? score == HALF_ANT_COUNT ? MAX_ANT_COUNT : 2 : 1; i--;)
                if (objectCount < HALF_ANT_COUNT | score == HALF_ANT_COUNT & objectCount < MAX_ANT_COUNT)
                    spawnObject();

            // draw blood
            for(i=29; i--;)
            {
                hsl(99, 50-Math.random()*20, .3);
                contextBack.beginPath(contextBack.fill(contextBack.ellipse(
                    p.x+p.r*(Math.random()*2-1), p.y+p.r*(Math.random()*2-1), 
                    p.r*(Math.random()+1)/2, p.r*(Math.random()+1)/7, 
                    Math.random()*9, 0, 9)));
            }
            drawAnt(p, contextBack);
        }
        if (p.v && Math.hypot(p.x - e.x, p.y - e.y) < 199)
        {
            // scare ant
            p.v = Math.random()*3 + 2; // change speed
            p.a = Math.atan2(p.x - e.x, e.y - p.y) + Math.random()*2-1; // run away
        }
    });
}

setInterval(update, 16); // 60 fps update