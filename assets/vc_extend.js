jQuery( document ).ready(function() {
      
        const SEOCHeck = (email, domain) => {

          const mutation = JSON.stringify({
            operationName: "checkSEO",
            variables: { email: email, url: domain },
            query: `mutation checkSEO ($email: String! $url: String!) { checkSEO (
                          email: $email
                          url: $url
                        ){
                          score
                          failed{
                            title
                            description
                            score
                          }
                            passed{
                            title
                            description
                            score
                          }
                      }}`
          })
        
          fetch(the_url, {
            headers: { "content-type": "application/json" },
            method: "POST",
            body: mutation
          }).then((res) => res.json()).then(data => {
            console.log(data);
            //console.log(data.data.checkSEO.failed);
            //console.log(data.data.checkSEO.passed);

            if( data.errors ){
              setTimeout(() => {
                jQuery('.seo-audit .message').fadeOut('slow', function(){
                  jQuery('.seo-audit form').fadeIn('slow', function(){
                    showMessage(data.errors[0].message);
                  });
                });
              }, 1000);
            }else{

              if( !data.data.checkSEO.failed && !data.data.checkSEO.passed ){
                  setTimeout(() => {
                    jQuery('.seo-audit .message').fadeOut('slow', function(){
                      jQuery('.seo-audit form').fadeIn('slow', function(){
                        showMessage('No results.');
                      });
                    });
                  }, 1000);
              }else{

                  jQuery('.scoreAudit').text(data.data.checkSEO.score);

                  if( data.data.checkSEO.failed ){
                    var failed_acc='';
                    jQuery.each(data.data.checkSEO.failed, function(i, item) {
                      //console.log(item);
                      failed_acc = failed_acc + '<div class="tab"><label class="tab-label" for="failed_' + i + '">'+ '• ' + htmlEntities(item.title) + '</label></div>';
                    });
                    jQuery('.seo-audit .failed .tabs').html(failed_acc);
                  }

                  if( data.data.checkSEO.passed ){
                    var passed_acc='';
                    jQuery.each(data.data.checkSEO.passed, function(i, item) {
                      //console.log(item);
                      passed_acc = passed_acc + '<div class="tab"><label class="tab-label" for="passed_' + i + '">'+ '• ' + htmlEntities(item.title) + '</label></div>';
                    });
                    jQuery('.seo-audit .passed .tabs').html(passed_acc);
                  }

                  jQuery('.seo-audit .message').fadeOut('slow', function(){
                    jQuery('.seo-audit .tabset').fadeIn('slow', function(){
                      jQuery('.seo-audit .scoreAudit').fadeIn('slow');
                    });
                  });
              }

            }
            

          }).catch(err => console.log(err))
        }

        function showMessage(value){
            jQuery('.seo-audit .alert').text(value);
            jQuery('.seo-audit .alert').fadeIn('fast');
            setTimeout(function() { 
              jQuery('.seo-audit .alert').fadeOut('fast'); 
            }, 5000);

        }

        jQuery(".sendQuery").on("click", function(e){
          e.preventDefault();
          let email = jQuery("#email_seo");
          let website = jQuery("#link_seo");
          
          if(email.val() === '') {
          	showMessage('Please entrer your email')
          } else if(!email.val().includes("@") || !email.val().includes(".")) {
          	showMessage('Email is invalid')
          }else if(website.val() === '') {
          	showMessage('Please enter your website')
          }else if(!website.val().includes(".")) {
          	showMessage('Website is invalid')
          } else if(!website.val().includes("www")){
          	showMessage('Website does not have the www')
          } else {
              jQuery('.seo-audit form').fadeOut('slow', function(){
                jQuery('.message').fadeIn('slow');
              });
              SEOCHeck( email.val() , `https://${website.val()}` );
          }
         
        } );

        function htmlEntities(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '');
        }
        
      
      });

      function toggleIcon(e) {
        jQuery(e.target)
                .prev(".panel-heading")
                .find(".more-less")
                .toggleClass("glyphicon-plus glyphicon-minus");
        }
        jQuery(".panel-group").on("hidden.bs.collapse", toggleIcon);
        jQuery(".panel-group").on("shown.bs.collapse", toggleIcon);