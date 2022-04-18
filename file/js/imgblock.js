const imgs = document.images;
for(const img of imgs) img.oncontextmenu =()=>false;
for(const img of imgs) img.onselectstart =()=>false;
for(const img of imgs) img.onmousedown =()=>false;