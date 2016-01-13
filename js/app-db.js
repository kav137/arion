/**
 * app-db Module
 *
 * This module provides all the functionality related to client-server-db interaction
 */
angular.module( 'app-db', [] )
    .constant( 'PATH', "\\arion\\arion?" )
    .constant( 'REJECTED', () => Promise.reject() )
    .service( 'databaseService', [ '$http', '$rootScope', 'appState', 'PATH', 'REJECTED', function ( $http, $rootScope, appState, PATH, REJECTED ) {

        var initElement = function ( element ) {
            if ( !checkElement ) return;

            appState.loading.start();
            // /arion?cn=INDIFFERENT&gn=Слюдяные&mt=Отечественная методика
            // do not escape characters
            var query = PATH + "cn=" + element.group + '&gn=' + element.subGroup + "&mt=" + element.owner;
            return $http.get( query )
                .then( function ( response, status, headers, config ) {
                    if ( checkAuthentification( response ) )
                        return REJECTED();

                    element.properties = response.data.properties;
                    element.coefficients = response.data.coefficients;
                    element.method = response.data.method;
                    initDefaultElementValues( element );

                    appState.loading.finish();
                    return element; //return promise for further interaction
                } )
                .catch( function ( response, status, headers, config ) {
                    alertify.error( "Ошибка взаимодействия с сервером" );
                    console.log( "Server error : " );
                    console.log( response );
                    appState.loading.finish();
                    return REJECTED();
                } )
        }

        function checkElement( element ) {
            if ( !( element.group && element.owner && element.subGroup ) ) {
                alertify.error( 'element.group/owner/class is undefined. impossible to send request to db' );
                return false;
            }
            return true;
        }

        //temporary function. remove later
        function checkAuthentification( response ) {
            if ( response.data === "Вы не авторизованы" ) {
                alert( 'your session has expired. please logout and login again' );
                return false;
            }
            return true;
        }

        function initDefaultElementValues( element ) {
            angular.forEach( element.properties, function ( prop ) {
                prop.value = null;
                if ( prop.Default ) {
                    if ( prop.Type == "1" || prop.Type == "2" ) {
                        prop.value = prop.Default;
                    }
                    if ( prop.Type == "4" ) {
                        prop.value = prop.Answer[ parseInt( prop.Default ) ];
                    }
                }
            } )

            angular.forEach( element.coefficients, function ( coef ) {
                coef.value = null;
            } )
            $rootScope.loading = false;
        }
    } ] )
