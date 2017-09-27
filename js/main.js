let app;
$(document).ready(function () {
    HomeManager.init();


    loadHeader();
    loadFooter();
    let session = checkSession();
    $.getJSON("js/data.json", function (json) {

        HomeManager.setProductsList(json.products);
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

            this.get('#/manage', function (context) {
                loadManageComponent();
            });

            this.get('#/manage/properties', function (context) {
                loadManageComponent(loadManageProperties);
            });

            this.get('#/manage/groups', function (context) {
                loadManageComponent(loadManageGroups);
            });

            this.get('#/addProduct', function (context) {
                loadAddProductComponent();
            });

            this.get('#/editProduct/:id', function (context) {
                loadAddProductComponent();
            });
            this.get('#/manage/properties/edit/:id', function (context) {
                loadEditPropertyComponent();
            });
        });
        if (session) {
            app.run('#/overview');
        }
    });

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

    window.location.hash = '#/manage/properties';
}

function loadManageProperties() {
    setTabHighlight(0, ".manage-container .navbar-menu");
    loadTemplate('js/templates/manageProperties.mst', 'manageSectionContainer');

    $(document).on("click", ".propertyRowActionHandler", function (el) {
        window.location.hash = '#/manage/properties/edit/' + this.id;
    });
}

function loadManageGroups() {
    setTabHighlight(1, ".manage-container .navbar-menu");
    loadTemplate('js/templates/manageGroups.mst', 'manageSectionContainer')
}

function loadAddProductComponent() {
    loadTemplate('js/templates/addProduct.mst', 'appContainer')
    setTabHighlight(1, ".header-container .navbar-menu");
}

function loadEditPropertyComponent() {
    loadTemplate('js/templates/editProperty.mst', 'appContainer', {}, {});
    setTabHighlight(3, ".header-container .navbar-menu");
    setTimeout(function () {
        $(".edit-left-nav-section .tablinks:nth-child(1)").click();
    },100)


}

function loadEditPropertyGroupComponent() {
    loadTemplate('js/templates/editProperty.mst', 'appContainer', {}, {});
    setTabHighlight(3, ".header-container .navbar-menu");
}



