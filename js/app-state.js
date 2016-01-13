/**
 * app-state Module
 *
 * This module provides information about app's state:
 * 1) routing
 * 2) authentification
 * 3) loading state ....and so on
 */
angular.module( 'app-state', [] )
    .service( 'appState', [ '$log', 'loadingState', function ( $log, loadingState ) {
        return {
            loading: loadingState
        }
    } ] )
    .service( 'loadingState', [ '$log', function ( $log ) {
        return {
            loading: {
                value: false,
                background: false
            }
            startBackground: function () {
                this.loading.value = true;
                this.loading.background = true;
            },
            start: function () {
                this.loading.value = true;
                this.loading.background = false;
            },
            _resetBackground: function () {
                this.loading.background = false;
            },
            finish: function () {
                this.loading = false;
                this._resetBackground();
            }
        }
    } ] )
