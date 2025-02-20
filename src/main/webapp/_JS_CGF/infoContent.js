function infoContent(){
    var content=`
    <h2>My Info</h2>
    <p>This is my info content page. This web app is built using HTML, CSS, and JavaScript.</p>
    `
    var ele=document.createElement("div");
    ele.innerHTML=content;
    return ele;
}