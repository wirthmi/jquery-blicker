/**
 * Copyright 2013 Michal Wirth <wirthmi@rankl.cz>
 *
 * This file is part of a jQuery Blicker plugin.
 *
 * The jQuery Blicker plugin is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * The jQuery Blicker plugin is distributed in the hope that it will be
 * useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with the jQuery Blicker plugin. If not,see <http://www.gnu.org/licenses/>.
 */


( function ( $ ) {

  /**
   * This "class" implements all plugin's behaviour.
   */
  $.blickerPlugin = function( blicker, userOptions ) {

    // reference to the plugin's current instance
    var instance = this;

    var defaultOptions = {
      autostart: true,
      blickDuration: 1000,
      silenceDuration: 10000,
      images: [ "background.jpg" ]
    };

    var options = { };
    var imageIndex = 0;
    var intervalHandle = false;

    /**
     * This "private" method drops all content of the blicker element and
     * builds new one with expected properties and structure.
     */
    var prepareBlickerStructure = function ( ) {

      blicker.empty( );

      blicker.append(
        document.createElement( "div" ),
        document.createElement( "div" )
      );

      blicker.children( ).css( {
        "width": "100%",
        "height": "100%",
        "margin": "0px",
        "padding": "0px",
        "background-image": "none",
        "background-repeat": "no-repeat",
        "background-position": "center center",
        "background-size": "cover"
      } );

      blicker.children( ":nth-child(1)" ).css( "display", "block" );
      blicker.children( ":nth-child(2)" ).css( "display", "none" );
    };

    /**
     * This "private" method returns currently visible blicker's child.
     */
    var getVisibleChild = function ( ) {

      return blicker.children( "div:visible" ).eq( 0 );
    };

    /**
     * This "private" method returns currently hidden blicker's child.
     */
    var getHiddenChild = function ( ) {

      return blicker.children( "div:not(:visible)" ).eq( 0 );
    };

    /**
     * This "private" method sets the current image index to a seed value.
     */
    var randomizeImageIndex = function ( ) {

      imageIndex =
        Math.floor( $.now( ) / options.silenceDuration ) %
        options.images.length;
    };

    /**
     * This "private" method changes current image index to a next valid value.
     */
    var updateImageIndex = function ( ) {

      if ( ++imageIndex >= options.images.length ) {
        imageIndex = 0;
      }
    };

    /**
     * This "private" method loads an image determined by the current image
     * index into the given child as a background image.
     */
    var loadImageIntoChildAccordingToImageIndex = function( child ) {

      updateImageIndex( );

      child.css(
        "background-image", "url('" + options.images[ imageIndex ] + "')"
      );
    };

    /**
     * This "private" method makes blicker to blick once.
     */
    var performSingleBlick = function ( ) {

      var halfBlickDuration =
        Math.floor( options.blickDuration / 2 );

      getVisibleChild( ).fadeOut( halfBlickDuration, function ( ) {
        var hiddenChild = getHiddenChild( );
        loadImageIntoChildAccordingToImageIndex( hiddenChild );
        hiddenChild.fadeIn( halfBlickDuration );
      } );
    };

    /**
     * This "public" method makes blicker to start blicking.
     */
    instance.startBlicking = function ( ) {

      var isAlreadyBlicking = ( intervalHandle !== false );
      var isBlickingPossible = ( options.images.length > 0 );

      if ( !isAlreadyBlicking && isBlickingPossible ) {

        // at first set initial image
        loadImageIntoChildAccordingToImageIndex( getVisibleChild( ) );

        // now plan later image blicks
        intervalHandle =
          setInterval( performSingleBlick, options.silenceDuration );
      }
    };

    /**
     * This "public" method makes blicker to stop blicking.
     */
    instance.stopBlicking = function( ) {

      // disable all planned image blicks
      clearInterval( intervalHandle );
      intervalHandle = false;
    };


    /**
     * Plugin's "public" constructor.
     */
    instance.init = function( ) {

      // gather final options for running the plugin
      options = $.extend( { }, defaultOptions, userOptions );

      prepareBlickerStructure( );
      randomizeImageIndex( );

      if ( options.autostart ) {
        instance.startBlicking( );
      }
    };

    // don't forget to actually run the plugin's constructor
    instance.init( );
  };


  /**
   * Function which registers the plugin among other jQuery's capabilities.
   */
  $.fn.blicker = function( options ) {

    var PLUGIN_DATA_KEY = "blicker";
    var blicker = $( this );

    return this.each( function ( ) {

      var isPluginInstanceAlreadyAttached =
        ( typeof blicker.data( PLUGIN_DATA_KEY ) !== "undefined" );

      if ( !isPluginInstanceAlreadyAttached ) {
        var pluginInstance = new $.blickerPlugin( blicker, options );
        blicker.data( PLUGIN_DATA_KEY, pluginInstance );
      }
    } );
  };

} )( jQuery );
