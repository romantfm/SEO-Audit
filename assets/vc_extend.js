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
              failed_acc = failed_acc + '<div class="tab"><input type="checkbox" id="failed_' + i + '"><label class="tab-label" for="failed_' + i + '">' + htmlEntities(item.title) + '</label><div class="tab-content">' + htmlEntities(item.description) + '</div></div>';
            });
            jQuery('.seo-audit .failed .tabs').html(failed_acc);

            var passed_acc='';
            jQuery.each(data.data.checkSEO.passed, function(i, item) {
              //console.log(item);
              passed_acc = passed_acc + '<div class="tab"><input type="checkbox" id="passed_' + i + '"><label class="tab-label" for="passed_' + i + '">' + htmlEntities(item.title) + '</label><div class="tab-content">' + htmlEntities(item.description) + '</div></div>';
            });
            jQuery('.seo-audit .passed .tabs').html(passed_acc);

            jQuery('.seo-audit .message').fadeOut('fast', function(){
              jQuery('.seo-audit .tabset').fadeIn('fast', function(){
                jQuery('.seo-audit .scoreAudit').fadeIn('fast');
              });
            });
            

          }).catch(err => console.log(err))
        }


        jQuery('body').on('submit','.seo-audit form',function(e){
           e.preventDefault();

           jQuery('.seo-audit form').fadeOut('slow', function(){
              jQuery('.message').fadeIn('fast');
            });
            SEOCHeck( jQuery("#email_seo").val() , jQuery("#link_seo").val() );
        });

        function htmlEntities(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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