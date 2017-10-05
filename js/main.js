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
                ga('send', 'pageview', location.hash);
                loadHomeScreen();
            });

            this.get('#/products', function (context) {
                ga('send', 'pageview', location.hash);
                loadProductsComponent();
            });

            this.get('#/assets', function (context) {
                ga('send', 'pageview', location.hash);
                loadAssetsComponent();
            });


            this.get('#/addProduct', function (context) {
                ga('send', 'pageview', location.hash);
                loadAddProductComponent();
            });

            this.get('#/editProduct/:id', function (context) {
                ga('send', 'pageview', location.hash);
                loadEditProductComponent();
            });


            this.get('#/manage', function (context) {
                ga('send', 'pageview', location.hash);
                window.location.hash = window.location.hash + "/properties";
            });

            this.get('#/manage/properties', function (context) {
                ga('send', 'pageview', location.hash);
                loadManageComponent(loadManageProperties);
            });
            this.get('#/manage/properties/:id', function (context) {
                ga('send', 'pageview', location.hash);
                window.location.hash = window.location.hash + "/details";
            });
            this.get('#/manage/properties/:id/details', function (context) {
                ga('send', 'pageview', location.hash);
                loadEditPropertyComponent({
                    id: context.params.id,
                    path: context.path.replace("details", ""),
                    fullPath: context.path
                });
            });
            this.get('#/manage/properties/:id/translations', function (context) {
                ga('send', 'pageview', location.hash);
                loadEditPropertyComponent({
                    id: context.params.id,
                    path: context.path.replace("translations", ""),
                    fullPath: context.path
                });
            });
            this.get('#/manage/properties/:id/security', function (context) {
                ga('send', 'pageview', location.hash);
                loadEditPropertyComponent({
                    id: context.params.id,
                    path: context.path.replace("security", ""),
                    fullPath: context.path
                });
            });
            this.get('#/manage/properties/:id/history', function (context) {
                ga('send', 'pageview', location.hash);
                loadEditPropertyComponent({
                    id: context.params.id,
                    path: context.path.replace("history", ""),
                    fullPath: context.path
                });
            });

            this.get('#/manage/groups', function (context) {
                ga('send', 'pageview', location.hash);
                loadManageComponent(loadManageGroups);
            });
            this.get('#/manage/groups/:id', function (context) {
                ga('send', 'pageview', location.hash);
                window.location.hash = window.location.hash + "/details";
            });
            this.get('#/manage/groups/:id/details', function (context) {
                ga('send', 'pageview', location.hash);
                loadEditGroupComponent({
                    id: context.params.id,
                    path: context.path.replace("details", ""),
                    fullPath: context.path
                });
            });
            this.get('#/manage/groups/:id/translations', function (context) {
                ga('send', 'pageview', location.hash);
                loadEditGroupComponent({
                    id: context.params.id,
                    path: context.path.replace("translations", ""),
                    fullPath: context.path
                });
            });
            this.get('#/manage/groups/:id/properties', function (context) {
                ga('send', 'pageview', location.hash);
                loadEditGroupComponent({
                    id: context.params.id,
                    path: context.path.replace("properties", ""),
                    fullPath: context.path
                });
            });
            this.get('#/manage/groups/:id/history', function (context) {
                ga('send', 'pageview', location.hash);
                loadEditGroupComponent({
                    id: context.params.id,
                    path: context.path.replace("history", ""),
                    fullPath: context.path
                });
            });
        });
        if (session) {
            app.run('#/overview');
        }else{
            app.run();
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
        window.location.reload(true);
        // loadLoginScreen();
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

    function loadProductsList(listData) {
        loadTemplate('js/templates/productsList.mst', 'productsListingContainer', listData, {
            productListView: HomeManager.getProductsListingTemplate(),
            productListRow: HomeManager.getProductsListingRowTemplate(),
            productGridView: HomeManager.getProducstGridTemplate(),
            productsGridItem: HomeManager.getProducstGridItemTemplate()
        });
    }

    function loadTmpl(listData) {
        loadTemplate('js/templates/products.mst', 'appContainer', listData, {}, function () {
            loadProductsList(listData);
            $(document).on("keyup", ".jsProductsSrch", function (event) {
                var searchKey = $(event.target).val();

                var clonedListData = JSON.parse(JSON.stringify(listData)); // cheap clone

                if (searchKey) {
                    clonedListData.products = clonedListData.products.filter(function (obj) {
                        return (obj.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1)
                    });
                }

                loadProductsList(clonedListData);
            });
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

function loadPropertiesList(properties) {
    loadTemplate('js/templates/propertiesList.mst', 'jsPropertiesList', {properties: properties});
}

function loadManageProperties() {
    loadTemplate('js/templates/manageProperties.mst', 'manageSectionContainer', {properties: HomeManager.getPropertiesList()}, {}, function () {
        loadPropertiesList(HomeManager.getPropertiesList());
        $(document).on("keyup", ".jsPropertiesSrch", function (event) {
            var searchKey = $(event.target).val();
            var properties = HomeManager.getPropertiesList();

            if (searchKey) {
                properties = properties.filter(function (obj) {
                    return (obj.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1)
                });
            }
            loadPropertiesList(properties)
        })
    });
    setTabHighlight(0, ".manage-container .navbar-menu");

    $(document).on("click", ".editProperty", function (el) {
        window.location.hash = '#/manage/properties/' + this.id.split(" ").join("-") + "/details";
    });
}

function loadGroupsList(groups) {
    loadTemplate('js/templates/propertyGroupsList.mst', 'jsGroupsList', {groups: groups});
}

function loadManageGroups() {

    loadTemplate('js/templates/manageGroups.mst', 'manageSectionContainer', {groups: HomeManager.getGroupsList()}, {}, function () {
        loadGroupsList(HomeManager.getGroupsList());
        $(document).on("keyup", ".jsGroupsSearch", function (event) {
            var searchKey = $(event.target).val();
            var groups = HomeManager.getGroupsList();

            if (searchKey) {
                groups = groups.filter(function (obj) {
                    return (obj.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1)
                });
            }
            loadGroupsList(groups);
        })
    })
    setTabHighlight(1, ".manage-container .navbar-menu");

    $(document).on("click", ".toggleGroupProps", function (el) {
        $(this).closest(".group-details").toggleClass('open').toggleClass('closed');
        el.stopImmediatePropagation();
        el.preventDefault();
    });
    $(document).on("click", ".editGroup", function (el) {
        window.location.hash = '#/manage/groups/' + this.id
    });
    $(document).on("click", ".group-props", function (el) {
        window.location.hash = '#/manage/properties/' + this.id.split(" ").join("-") + "/details";
    });

}

function loadAddProductComponent() {
    loadTemplate('js/templates/addProduct.mst', 'appContainer')
    setTabHighlight(1, ".header-container .navbar-menu");
}

function loadEditProductComponent() {
    loadTemplate('js/templates/editProduct.mst', 'appContainer')
    setTabHighlight(1, ".header-container .navbar-menu");
}

function loadEditPropertyComponent(meta) {
    let obj = {
        name: meta.id.split("-").join(" "),
        urlParam: meta.id,
        path: meta.path
    }
    meta.tabName = getPathLastParam(meta.fullPath);
    let userRoles =HomeManager.getUserState().roles;
    let isEditor = userRoles.indexOf("EDITOR");
    obj.isEditor = (isEditor >= 0) ? true: false;
    loadTemplate('js/templates/editProperty.mst', 'appContainer', obj, {}, editPropertyCallback.bind(meta));
    setTabHighlight(3, ".header-container .navbar-menu");

}

function editPropertyCallback() {
    openTab(this.tabName);
    $('.toggle-trigger').bootstrapToggle({
        on: 'Yes',
        off: 'No'
    });
    $('select.selectpicker').selectpicker({
        caretIcon: 'glyphicon glyphicon-menu-down'
    });

    $('.toggle-trigger').change(function (event) {
        let that = this;
        if (this.checked) {
            let radioBtns = $($(this).closest(".table-row")).find(".toggle-trigger")
            radioBtns.each(function (index) {
                if (this.name !== that.name) {
                    $(this).bootstrapToggle('off');
                }
            });
            let checkBox = $($(this).closest(".table-row")).find(".securityToggle")[0];
            checkBox.checked = true;
        } else {
            if ($(this).closest(".table-row").find("input.toggle-trigger").not(':checked').length === 3) {
                let checkBox = $($(this).closest(".table-row")).find(".securityToggle")[0];
                checkBox.checked = false;
            }
        }
    });
    $('#security :checkbox').click(function (event) {
        if (!this.checked) {
            let radioBtns = $($(this).closest(".table-row")).find(".toggle-trigger")
            radioBtns.each(function (index) {
                $(this).bootstrapToggle('off');
            });
        } else {
            if ($(this).closest(".table-row").find("input.toggle-trigger").not(':checked').length === 3) {
                let radioBtns = $($(this).closest(".table-row")).find(".toggle-trigger")
                $(radioBtns[0]).bootstrapToggle('on');
            }
        }
    })
}

function loadEditGroupComponent(meta) {
    let id = meta.id
    let obj = {
        urlParam: meta.id,
        path: meta.path,
        groupObj: HomeManager.getGroupById(id)
    }
    meta.tabName = getPathLastParam(meta.fullPath);
    let userRoles =HomeManager.getUserState().roles;
    let isEditor = userRoles.indexOf("EDITOR");
    obj.isEditor = (isEditor >= 0) ? true: false;
    loadTemplate('js/templates/editGroup.mst', 'appContainer', obj, {}, editGroupCallback.bind(meta));
    setTabHighlight(3, ".header-container .navbar-menu");
}

function editGroupCallback() {
    openTab(this.tabName)
    $('.toggle-trigger').bootstrapToggle({
        on: 'Yes',
        off: 'No'
    });
    $('select.selectpicker').selectpicker({
        caretIcon: 'glyphicon glyphicon-menu-down'
    });
}

function getPathLastParam(path) {
    let pathList = path.split("/")
    return pathList[pathList.length -1]
}

function getJSON(x){
    let childs = x.children;
    let len=childs.length;
    let list = [];
    let obj = {}

    for(var i=0; i<len; i++){
        let data = childs[i];
        obj.id = Math.floor(Math.random()*90000000) + 10000000;
        obj.skuId = data.dataset.asin;
        obj.imageUrl = data.querySelector(".s-access-image").src;
        obj.name = data.querySelector(".s-access-title").innerText;
        obj.price = data.querySelector(".s-price").innerText;
        obj.category = "Denims";
        obj.addedOn = "Denims";
        obj.currency = "$";
        obj.status = ["green", "red", "orange"][Math.floor(Math.random() * 3)];

        list.push(obj);
    }

    return list.toString();
}


