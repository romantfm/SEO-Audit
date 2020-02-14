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

            jQuery('.scoreAudit').text(data.data.checkSEO.score);

            var failed_acc='';
            jQuery.each(data.data.checkSEO.failed, function(i, item) {
              //console.log(item);
              failed_acc = failed_acc + '<div class="tab"><label class="tab-label" for="failed_' + i + '">'+ '• ' + htmlEntities(item.title) + '</label></div>';
            });
            jQuery('.seo-audit .failed .tabs').html(failed_acc);

            var passed_acc='';
            jQuery.each(data.data.checkSEO.passed, function(i, item) {
              //console.log(item);
              passed_acc = passed_acc + '<div class="tab"><label class="tab-label" for="passed_' + i + '">'+ '• ' + htmlEntities(item.title) + '</label></div>';
            });
            jQuery('.seo-audit .passed .tabs').html(passed_acc);

            jQuery('.seo-audit .message').fadeOut('slow', function(){
              jQuery('.seo-audit .tabset').fadeIn('slow', function(){
                jQuery('.seo-audit .scoreAudit').fadeIn('slow');
              });
            });
            

          }).catch(err => console.log(err))
        }

        jQuery(".sendQuery").on("click", function(e){
          e.preventDefault();
          let email = jQuery("#email_seo");
          let website = jQuery("#link_seo");
          
          if(email.val() === '') {
          	alert('Please entrer your email')
          } else if(!email.val().includes("@") || !email.val().includes(".")) {
          	alert('email is invalid')
          }else if(website.val() === '') {
          	alert('Please enter your website')
          }else if(!website.val().includes(".")) {
          	alert('website is invalid')
          } else if(!website.val().includes("www")){
          	alert('website does not have the www')
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