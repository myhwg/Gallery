$( function() {
    var pictures = [],
        $pointer = $( '#pointer' ),
        $thumbnails = $( '#thumbnails' ),
        $title = $( '#title' ),
        $pause = $( '#pause' ),
        $flash = $( '#flash' ),
        $volume = $( '#volume' );

    // Buzz audio library

    buzz.defaults.formats = [ 'ogg', 'mp3' ];

    var timeSound = new buzz.sound( 'sounds/sea' ),
        seaSound = new buzz.sound('sounds/time'),
        cameraSounds = new buzz.group(timeSound, seaSound);

    if ( !buzz.isSupported() ) {
        $volume.hide();    
    }
    
    seaSound.loop().play().fadeIn(5000);
    // jScrollPane

    $thumbnails.find( 'ul' ).width( function() {
        var totalWidth = 0;
        $( this ).find( 'li' ).each( function() {
            totalWidth += $( this ).outerWidth( true );
        });
        return totalWidth;
    });

    $thumbnails.jScrollPane();

    var jScrollPaneApi = $thumbnails.data( 'jsp' );

    $( window ).bind( 'resize', function() {
        jScrollPaneApi.reinitialise();
    });

    // Vegas Background

    $thumbnails.find( 'a' ).each( function() {
        pictures.push({
            src: $( this ).attr( 'href' ),    
            title: $( this ).find( 'img' ).attr( 'title' ),
            valign: $( this ).find( 'img' ).data( 'valign' )
        });
    })

    $.vegas( 'slideshow', { 
        backgrounds: pictures,
        delay: 4000
     })( 'overlay' );
    
    $( 'body' ).bind( 'vegasload', function( e, img ) {
        var src = $( img ).attr( 'src' ),
            idx = $( 'a[href="' + src + '"]' ).parent( 'li' ).index();
    
        $title.fadeOut( function() {
            $( this ).find( 'h1' ).text( pictures[ idx ].title );
            $(this).fadeIn();

            var imgsrc = pictures[idx].src;
            $("#downloadimg").attr("href", imgsrc);
        });

        $flash.show().fadeOut( 1000 );

        var pointerPosition = $thumbnails.find( 'li' ).eq( idx ).position().left;
            
        $pointer.animate({
            left: pointerPosition
        }, 500, 'easeInOutBack' );

        if ( ( pointerPosition > $thumbnails.width() || pointerPosition < jScrollPaneApi.getContentPositionX() ) && !$thumbnails.is( ':hover' ) ) {
            jScrollPaneApi.scrollToX( pointerPosition, true );
        }

        $pointer.click( function() {
            $thumbnails.find( 'a' ).eq( idx ).click()
        });
    });

    // Volume button

    $volume.click( function() {
        if ( $( this ).hasClass( 'all' ) ) {
            cameraSounds.unmute();
            seaSound.mute();        
            $(this).removeClass('all').addClass('none');
        } else {
            cameraSounds.mute();
            seaSound.unmute();
        
            $( this ).removeClass( 'none' ).addClass( 'all' );
        }
        return false;
    });

    // Photograph

    $thumbnails.find( 'a' ).click( function() {
        $pause.show();
        $pointer.hide();
    
        //$volume.animate({ bottom: '20px' });
        $thumbnails.animate( { top: '-90px' });
        $title.animate( { bottom: '-90px' });    

        var idx = $( this ).parent( 'li' ).index();
        $.vegas( 'slideshow', { step: idx } )( 'pause' );
   
        return false;
    });

    $pause.click( function() {
        $pause.hide();
        $pointer.show();
    
        //$volume.animate( { bottom:'100px' });
        $title.animate( { bottom:'0px' });
        $thumbnails.animate( { top:'0px' });

        $.vegas( 'slideshow' );

        return false;
    });
});
