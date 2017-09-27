let HomeManager = function () {
    let user, metaData, productsList;
    let listinTableTemplate;
    let listinRowTemplate;
    let gridTemplate;
    let gridItemTemplate;
    init = function (equals, currNumber) {
        user = {
            userName: "",
            loggedIn: false,
            roles: []
        };

        metaData = {
            tableView: true,
            listingStyle: "comfortable"
        }
        $.get("js/templates/productsListing.mst", function (template) {
            listinTableTemplate = template;
        });
        $.get("js/templates/productsGrid.mst", function (template) {
            gridTemplate = template;
        });
        $.get("js/templates/tableRow.mst", function (template) {
            listinRowTemplate = template;
        });

        $.get("js/templates/gridItem.mst", function (template) {
            gridItemTemplate = template;
        });
    };
    setUserState = function (userObj) {
        user = userObj;
        user.loggedIn = true;
        user.lastLoggedIn = new Date().getTime();

        localStorage.setItem("userObj", JSON.stringify(user));
    };
    getUserState = function () {
        return user;
    };

    getMetaData = function () {
        return metaData;
    };

    setMetaData = function (meta) {
        metaData = meta;
        localStorage.setItem("metaObj", JSON.stringify(metaData));
    };
    getProductsList = function () {
        return productsList;
    };

    setProductsList = function (list) {
        productsList = list;
    };

    logoutUser = function () {
        user.loggedIn = false;
        localStorage.setItem("userObj", JSON.stringify(user));
    };

    getProducstGridTemplate = function () {
        return gridTemplate;
    };

    getProductsListingTemplate = function () {
        return listinTableTemplate;
    };
    getProductsListingRowTemplate = function () {
        return listinRowTemplate;
    };
    getProducstGridItemTemplate = function () {
        return gridItemTemplate;
    };


    return {
        init: init,
        setUserState: setUserState,
        getUserState: getUserState,
        getMetaData: getMetaData,
        setMetaData: setMetaData,
        getProductsList: getProductsList,
        setProductsList: setProductsList,
        logoutUser: logoutUser,
        getProductsListingTemplate: getProductsListingTemplate,
        getProducstGridTemplate: getProducstGridTemplate,
        getProductsListingRowTemplate: getProductsListingRowTemplate,
        getProducstGridItemTemplate: getProducstGridItemTemplate
    };
}();