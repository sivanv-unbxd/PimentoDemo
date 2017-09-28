let app;
$(document).ready(function () {
    HomeManager.init();


    loadHeader();
    loadFooter();
    let session = checkSession();
    let getProducts = $.getJSON("js/productsData.json", function (json) {
        HomeManager.setProductsList(json.products);
    });
    let getProperties = $.getJSON("js/propertiesData.json", function (json) {
        HomeManager.setPropertiesList(json.properties);
        HomeManager.setGroupsList(json.properties);
    })
    $.when(getProducts, getProperties).done(function () {
        app = $.sammy('#appContainer', function () {
            this.get('#/', function (context) {
                loadHomeScreen();
            });
            this.get('#/overview', function (context) {
                loadHomeScreen();
            });

            this.get('#/products', function (context) {
                loadProductsComponent();
            });

            this.get('#/assets', function (context) {
                loadAssetsComponent();
            });




            this.get('#/addProduct', function (context) {
                loadAddProductComponent();
            });

            this.get('#/editProduct/:id', function (context) {
                loadAddProductComponent();
            });



            this.get('#/manage', function (context) {
                window.location.hash = window.location.hash + "/properties";
            });

            this.get('#/manage/properties', function (context) {
                loadManageComponent(loadManageProperties);
            });
            this.get('#/manage/properties/:id', function (context) {
                window.location.hash = window.location.hash + "/details";
            });
            this.get('#/manage/properties/:id/details', function (context) {
                loadEditPropertyComponent({tabInd: 1, id: context.params.id, path : context.path.replace("details", "")});
            });
            this.get('#/manage/properties/:id/translations', function (context) {
                loadEditPropertyComponent({tabInd: 2, id: context.params.id, path : context.path.replace("translations", "")});
            });
            this.get('#/manage/properties/:id/security', function (context) {
                loadEditPropertyComponent({tabInd: 3, id: context.params.id, path : context.path.replace("security", "")});
            });
            this.get('#/manage/properties/:id/history', function (context) {
                loadEditPropertyComponent({tabInd: 4, id: context.params.id, path : context.path.replace("history", "")});
            });

            this.get('#/manage/groups', function (context) {
                loadManageComponent(loadManageGroups);
            });
            this.get('#/manage/groups/:id', function (context) {
                window.location.hash = window.location.hash + "/details";
            });
            this.get('#/manage/groups/:id/details', function (context) {
                loadEditGroupComponent({tabInd: 1, id: context.params.id, path : context.path.replace("details", "")});
            });
            this.get('#/manage/groups/:id/translations', function (context) {
                loadEditGroupComponent({tabInd: 2, id: context.params.id, path : context.path.replace("translations", "")});
            });
            this.get('#/manage/groups/:id/properties', function (context) {
                loadEditGroupComponent({tabInd: 3, id: context.params.id, path : context.path.replace("properties", "")});
            });
            this.get('#/manage/groups/:id/history', function (context) {
                loadEditGroupComponent({tabInd: 4, id: context.params.id, path : context.path.replace("history", "")});
            });
        });
        if (session) {
            app.run('#/overview');
        }
    })


});

function checkSession() {
    let userObj = localStorage.getItem("userObj");
    let currentLoginTime = new Date().getTime();
    let user = (userObj) ? JSON.parse(userObj) : "";
    if (user && user.loggedIn && (currentLoginTime - user.lastLoggedIn) < 43200000) {
        user.lastLoggedIn = currentLoginTime;
        let metaObj = localStorage.getItem("metaObj");
        let meta = (metaObj) ? JSON.parse(metaObj) : "";
        HomeManager.setUserState(user);
        if (meta) {
            HomeManager.setMetaData(meta);
        }
        return true;
    } else {
        loadLoginScreen();
        $(document).on("keypress", "input", function (e) {
            if (e.which == 13) {
                let userLoggedIn = LoginManager.logInUser({
                    userName: $("#userName").val(),
                    password: $("#password").val()
                });
                if (userLoggedIn) {
                    loadHeader();
                    loadHomeScreen();
                }
            }
        });
        $(document).on("click", "#loginSubmit", function () {
            let userLoggedIn = LoginManager.logInUser({userName: $("#userName").val(), password: $("#password").val()});
            if (userLoggedIn) {
                loadHeader();
                loadHomeScreen();
            }
        });
    }
}

function loadHeader() {
    $.get('js/templates/header.mst', function (template) {
        let rendered = Mustache.render(template, HomeManager.getUserState());
        $('#header').html(rendered);
    });
    $(document).on("click", "#logoutPimento", function () {
        HomeManager.logoutUser();
        loadLoginScreen();
    });

}

function loadFooter() {
    $.get('js/templates/footer.mst', function (template) {
        var rendered = Mustache.render(template);
        $('#footer').html(rendered);
    });
}

function loadLoginScreen() {
    loadHeader();
    loadLoginComponent();
}

function loadLoginComponent() {
    $.get('js/templates/login.mst', function (template) {
        var rendered = Mustache.render(template);
        $('#appContainer').html(rendered);
    });
}

function loadHomeScreen() {
    loadTemplate('js/templates/overview.mst', 'appContainer')
    setTabHighlight(0, ".header-container .navbar-menu");
}

function loadProductsComponent() {
    let data = {
        products: HomeManager.getProductsList(),
        meta: HomeManager.getMetaData(),
        listingStyle: "comfortable"
    }
    loadTmpl(data);
    setTabHighlight(1, ".header-container .navbar-menu");
    $(document).on("click", "#checkAllProducts", function () {
        $(".grid-check-box").prop('checked', $(this).prop('checked'));
    });
    $(document).on("click", ".rowActionHandler", function (el) {
        if (el.target.className.indexOf("editRow") > -1) {
            window.location.hash = '#/editProduct/' + this.id;
        }
        if (el.target.className.indexOf("deleteRow") > -1) {
            let that = this;
            _.remove(data.products, function (prod) {
                return prod.id === parseInt(that.id);
            });
            data.products.splice((parseInt(this.id) - 1), 1);
            loadTmpl(data)
        }

    });

    $(document).on("click", ".gridActionsHandler", function (el) {
        if (el.target.className.indexOf("editItem") > -1) {
            window.location.hash = '#/editProduct/' + this.id;
        }
        if (el.target.className.indexOf("deleteItem") > -1) {
            let that = this;
            _.remove(data.products, function (prod) {
                return prod.id === parseInt(that.id);
            });
            data.products.splice((parseInt(this.id) - 1), 1);
            loadTmpl(data)
        }

        if (el.target.className.indexOf("selectItem") > -1) {
            this.classList.toggle("selected");
        }

    });
    $(document).on("click", "#gridActions", function (el) {
        data.meta.changed = true;
        if (el.target.innerText === "Change to Grid View") {
            data.meta.tableView = false;
        } else if (el.target.innerText === "Change to List View") {
            data.meta.tableView = true;
        } else if (el.target.innerText === "Comfortable") {
            data.meta.listingStyle = "comfortable";
        } else if (el.target.innerText === "Compact") {
            data.meta.listingStyle = "compact";
        } else if (el.target.innerText === "Cozy") {
            data.meta.listingStyle = "cozy";
        } else {
            data.meta.changed = false;
        }
        if (data.meta.changed) {
            data.meta.changed = false;
            HomeManager.setMetaData(data.meta)
            loadTmpl(data)
        }
    });

    function loadTmpl(listData) {
        loadTemplate('js/templates/products.mst', 'appContainer', listData, {
            productListView: HomeManager.getProductsListingTemplate(),
            productListRow: HomeManager.getProductsListingRowTemplate(),
            productGridView: HomeManager.getProducstGridTemplate(),
            productsGridItem: HomeManager.getProducstGridItemTemplate()
        })
    }
}

function loadAssetsComponent() {
    loadTemplate('js/templates/assets.mst', 'appContainer')
    setTabHighlight(2, ".header-container .navbar-menu");
}

function loadManageComponent(callback) {


    loadTemplate('js/templates/manage.mst', 'appContainer', {}, {}, callback);
    setTabHighlight(3, ".header-container .navbar-menu");


}

function loadManageProperties() {
    loadTemplate('js/templates/manageProperties.mst', 'manageSectionContainer',{properties :  HomeManager.getPropertiesList()});
    setTabHighlight(0, ".manage-container .navbar-menu");

    $(document).on("click", ".editProperty", function (el) {
        window.location.hash = '#/manage/properties/' + this.id.split(" ").join("-");
    });
}

function loadManageGroups() {

    loadTemplate('js/templates/manageGroups.mst', 'manageSectionContainer', {groups :  HomeManager.getGroupsList()})
    setTabHighlight(1, ".manage-container .navbar-menu");

    $(document).on("click", ".toggleGroupProps", function (el) {
        $(this).closest(".group-details").toggleClass('open').toggleClass('closed');
        el.stopImmediatePropagation();
        el.preventDefault();
    });
    $(document).on("click", ".editGroup", function (el) {
        window.location.hash = '#/manage/groups/' + this.id
    });

}

function loadAddProductComponent() {
    loadTemplate('js/templates/addProduct.mst', 'appContainer')
    setTabHighlight(1, ".header-container .navbar-menu");
}

function loadEditPropertyComponent(meta) {
    let metaData = meta;
    let obj = {
        name : meta.id.split("-").join(" "),
        urlParam: meta.id,
        path : meta.path
    }
    loadTemplate('js/templates/editProperty.mst', 'appContainer', obj, {});
    setTabHighlight(3, ".header-container .navbar-menu");
    setTimeout(function () {
        $(".edit-left-nav-section .tablinks:nth-child(" + metaData.tabInd + ")").click();
        $('.toggle-trigger').bootstrapToggle({
            on: 'Yes',
            off: 'No'
        });
        $('select.selectpicker').selectpicker({
            caretIcon: 'glyphicon glyphicon-menu-down'
        });
    }, 500)


}

function loadEditGroupComponent(meta) {
    let metaData = meta;
    let id = meta.id
    let obj = {
        urlParam: meta.id,
        path : meta.path,
        groupObj : HomeManager.getGroupById(id)
    }
    loadTemplate('js/templates/editGroup.mst', 'appContainer', obj, {});
    setTabHighlight(3, ".header-container .navbar-menu");
    setTimeout(function () {
        $(".edit-left-nav-section .tablinks:nth-child(" + metaData.tabInd + ")").click();
        $('.toggle-trigger').bootstrapToggle({
            on: 'Yes',
            off: 'No'
        });
        $('select.selectpicker').selectpicker({
            caretIcon: 'glyphicon glyphicon-menu-down'
        });
    }, 500)


}

function loadEditPropertyGroupComponent() {
    loadTemplate('js/templates/editProperty.mst', 'appContainer', {}, {});
    setTabHighlight(3, ".header-container .navbar-menu");
}



