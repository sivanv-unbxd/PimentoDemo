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
