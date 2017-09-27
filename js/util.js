function setTabHighlight(ind, navbar){
    $(navbar +  " >li.active").removeClass("active");
    $($(navbar ).children()[ind]).toggleClass("active");
}



function loadTemplate(templatePath, destination, data, partial, callback) {
    $.when( $.get(templatePath, function (template) {
        let rendered;
             rendered = Mustache.render(template, data, partial);
        $('#'+ destination).html(rendered);
    })).done(callback)
}


function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.target.className += " active";
}