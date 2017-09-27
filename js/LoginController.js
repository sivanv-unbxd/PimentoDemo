let LoginManager = function () {

    let userTables = [
        {
            userName: "sivanv@unbxd.com",
            headerName: "sivanv@unbxd.com",
            password: "zaq12wsx",
            roles: ["ADMIN"]
        },
        {
            userName: "test@unbxd.com",
            headerName: "test@unbxd.com",
            password: "zaq12wsx",
            roles: ["ADMIN"]
        },
        {
            userName: "ad@unbxd.com",
            headerName: "ad@unbxd.com",
            password: "zaq12wsx",
            roles: ["ADMIN"]
        }
        ,
        {
            userName: "anupama.h@unbxd.com",
            headerName: "anupama.h@unbxd.com",
            password: "zaq12wsx",
            roles: ["ADMIN"]
        },
        {
            userName: "dj@unbxd.com",
            headerName: "dj@unbxd.com",
            password: "zaq12wsx",
            roles: ["ADMIN"]
        },
        {
            userName: "pp@unbxd.com",
            headerName: "pp@unbxd.com",
            password: "zaq12wsx",
            roles: ["ADMIN"]
        },
        {
            userName: "pimento@unbxd.com",
            headerName: "pimento@unbxd.com",
            password: "zaq12wsx",
            roles: ["ADMIN"]
        }
    ];
    logInUser = function (userObj) {
        let user =  _.filter(userTables, function(o) {
            return o.userName == userObj.userName && o.password == userObj.password
        });
        user = user[0]
        if (user) {


            HomeManager.setUserState(user);
            return true;
        }


    }


    return {
        logInUser : logInUser
    };
}();