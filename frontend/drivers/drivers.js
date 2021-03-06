/**
 * Drivers
 * Display a list of available drivers and implements all possible actions.
 * You can display all drivers or filter them by type or name
 *
 * Directive example:
 * <drivers types="'...'" names="'...'" header="'...'"></drivers>
 * With:
 *  - types (string): comma separated list of types to filter on
 *  - names (string): comma separated list of names to filter on
 *  - header (string): header title of list (default "Drivers"). Set empty string to remove header
 */
var driversDirective = function($rootScope, rpcService, cleepService, confirmService, toastService) {

    var driversController = ['$scope', function($scope) {
        var self = this;
        self.drivers = [];
        self.types = [];
        self.names = [];
        self.header = '';

        /**
         * Init directive
         */
        self.init = function()
        {
            //fill drivers according to specified filters
            cleepService.getDrivers()
                .then(function(drivers) {
                    self.setDrivers(drivers);
                });
        };

        /**
         * Set drivers
         */
        self.setDrivers = function(drivers)
        {
            if( self.types.length>0 || self.names.length>0 )
            {
                drivers = drivers.filter(function(driver) {
                    return !(self.types.indexOf(driver.drivertype)===-1 && self.names.indexOf(driver.drivername)===-1);
                });
            }
            self.drivers = drivers;
        };

        /**
         * Install driver
         */
        self.install = function(driver) {
            confirmService.open('Install driver', 'Confirm "'+driver.drivername+'" driver installation ?<br>Depending on things to install, driver installation may take several minutes.<br><br>After installation device will reboot.', 'Install', 'Cancel')
                .then(function() {
                    rpcService.sendCommand('install_driver', 'system', {'driver_type': driver.drivertype, 'driver_name': driver.drivername});
                });
        };

        /**
         * Uninstall driver
         */
        self.uninstall = function(driver) {
            confirmService.open('Uninstall driver', 'Confirm "'+driver.drivername+'" driver uninstallation ?<br><strong>Please note after driver uninstallation handled hardware should not work!</strong><br><br>After uninstallation device will reboot.', 'Uninstall', 'Cancel')
                .then(function() {
                    rpcService.sendCommand('uninstall_driver', 'system', {'driver_type': driver.drivertype, 'driver_name': driver.drivername});
                });
        };

        /**
         * Repair driver
         */
        self.repair = function(driver) {
            confirmService.open('Repair driver', 'This will reinstall "'+driver.drivername+'" driver. Do you confirm ?<br><br>After reinstall device will reboot.', 'Reinstall', 'Cancel')
                .then(function() {
                    rpcService.sendCommand('install_driver', 'system', {'driver_type': driver.drivertype, 'driver_name': driver.drivername, 'force': true});
                });
        };

        /** 
         * Watch for config changes
         */
        $rootScope.$watchCollection(function() {
            return cleepService.drivers;
        }, function(newDrivers, oldDrivers) {
            if( newDrivers )
            {   
                self.setDrivers(newDrivers);
            }   
        });

        /**
         * Watch for driver install event
         */
        $rootScope.$on('system.driver.install', function(event, uuid, params) {
            cleepService.reloadDrivers();
            if( params && params.success===true )
            {
                toastService.success('Driver installed successfully');
            }
            else if( params && params.success===false )
            {
                toastService.error('Error installing driver: "' + params.message + '"');
                console.error('Install driver failed:', params.message);
            }
        });

        /**
         * Watch for driver install event
         */
        $rootScope.$on('system.driver.uninstall', function(event, uuid, params) {
            cleepService.reloadDrivers();
            if( params && params.success===true )
            {
                toastService.success('Driver uninstalled successfully');
            }
            else if( params && params.success===false )
            {
                toastService.error('Error uninstalling driver: "' + params.message + '"');
                console.error('Uninstall driver failed:', params.message);
            }
        });

    }];

    var driversLink = function(scope, element, attrs, controller) {
        controller.types = scope.types ? scope.types.split(',') : [];
        controller.names = scope.names ? scope.names.split(',') : [];
        controller.header = scope.header===undefined ? 'Drivers' : scope.header;

        controller.init();
    };

    return {
        restrict: 'AE',
        templateUrl: 'drivers/drivers.html',
        replace: true,
        scope: {
            types: '=',
            names: '=',
            header: '=',
        },
        controller: driversController,
        controllerAs: 'driversCtl',
        link: driversLink
    };

};
    
var Cleep = angular.module('Cleep');
Cleep.directive('drivers', ['$rootScope', 'rpcService', 'cleepService', 'confirmService', 'toastService', driversDirective]);

