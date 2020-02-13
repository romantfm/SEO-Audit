<?php
/*
Plugin Name: SEO Audit
Plugin URI: http://topfloormarketing.net
Description: Plugin Premium
Version: 1.0.0
Author: Top Floor Marketing
Author URI: http://topfloormarketing.net
License: GPLv2 or later
*/

// don't load directly
if (!defined('ABSPATH')) die('-1');

class SEOAuditClass {
    function __construct() {
        // We safely integrate with VC with this hook
        add_action( 'init', array( $this, 'integrateWithVC' ) );
 
        // Use this when creating a shortcode addon
        add_shortcode( 'bartag', array( $this, 'renderMyBartag' ) );

        // Register CSS and JS
        add_action( 'wp_footer', array( $this, 'loadCssAndJs' ) );

        add_action( 'wp_footer', array( $this, 'showAll' ) );
    }
 
    public function integrateWithVC() {
        // Check if WPBakery Page Builder is installed
        if ( ! defined( 'WPB_VC_VERSION' ) ) {
            // Display notice that Extend WPBakery Page Builder is required
            add_action('admin_notices', array( $this, 'showVcVersionNotice' ));
            return;
        }
 
        vc_map( array(
            "name" => __("SEO Audit", 'vc_extend'),
            "description" => __("", 'vc_extend'),
            "base" => "bartag",
            "class" => "",
            "controls" => "full",
            "icon" => plugins_url('assets/asterisk_yellow.png', __FILE__), // or css class name which you can reffer in your css file later. Example: "vc_extend_my_class"
            "category" => __('Content', 'js_composer'),
            //'admin_enqueue_js' => array(plugins_url('assets/vc_extend.js', __FILE__)), // This will load js file in the VC backend editor
            //'admin_enqueue_css' => array(plugins_url('assets/vc_extend_admin.css', __FILE__)), // This will load css file in the VC backend editor
            "params" => array(
                array(
                  "type" => "textfield",
                  "holder" => "div",
                  "class" => "",
                  "heading" => __("Text", 'vc_extend'),
                  "param_name" => "url_seo",
                  "value" => __("", 'vc_extend'),
                  "description" => __("Ex: https://tfm-web-api.herokuapp.com/graphql", 'vc_extend')
              ),
            
            )
        ) );
    }
    
    /*
    Shortcode logic how it should be rendered
    */
    public function renderMyBartag( $atts ) {
      extract( shortcode_atts( array(
        'url_seo' => 'https://tfm-web-api.herokuapp.com/graphql',
      ), $atts ) );
      //$content = wpb_js_remove_wpautop($content, true); // fix unclosed/unwanted paragraph tags in $content

      //wp_enqueue_script( 'vc_extend_js', plugins_url('assets/jquery-3.4.1.min.js', __FILE__), array('jquery') );
      //echo plugin_dir_path(__DIR__) ;
      //echo '<script src="' . plugin_dir_url( __FILE__ ) . 'assets/jquery-3.4.1.min.js' . '"></script>';
      //echo '<style href="' . plugin_dir_url( __FILE__ ) . 'assets/vc_extend.css' . '"></style>';

      $the_url = ${url_seo};

      ?>

      <div class="seo-audit">

      <h2>Online SEO Audit</h2>

        <div class="scoreAudit">
          91
        </div>

        <form action="#">
          <input type="text" id="email_seo" name="email_seo" value="123@123.com" placeholder="Email">
          <input type="text" id="link_seo" name="link_seo" value="http://topfloormarketing.net" placeholder="Url">
          <a href="#" class="sendQuery">Send</a>
        </form>

        <div class="message">
          <!--div class="spinner-box">
            <div class="circle-border">
              <div class="circle-core"></div>
            </div>
          </div-->
          <h3>Calculating your SEO score... </h3>
          <p>Tip: Did you know that we use Google's lighthouse to assess your webpage</p>

        </div>

        <div class="tabset">

          <input type="radio" name="tabset" id="tab1" aria-controls="tfailed" checked>
          <label for="tab1">Failed</label>

          <input type="radio" name="tabset" id="tab2" aria-controls="tpassed">
          <label for="tab2">Passed</label>

          <div class="tab-panels">
            <section id="tfailed" class="tab-panel">
              <div class="failed">
                <div class="tabs"></div>
              </div>
            </section>
            <section id="tpassed" class="tab-panel">
              <div class="passed">
                <div class="tabs"></div>
              </div>
            </section>
          </div>

        </div>

      </div>

      <script type="text/javascript">
        var the_url = "<?php echo $the_url; ?>";
      </script>

      <?php

    }

    /*
    Load plugin css and javascript files which you may need on front end of your site
    */
    public function loadCssAndJs() {
      wp_register_style( 'vc_extend_style', plugins_url('assets/vc_extend.css', __FILE__) );
      wp_enqueue_style( 'vc_extend_style' );    

      wp_enqueue_script( 'vc_extend_js', plugins_url('assets/vc_extend.js', __FILE__), array('jquery') );
    }

    public function showAll($atts) {
      extract( shortcode_atts( array(
        'url_seo' => 'https://tfm-web-api.herokuapp.com/graphql',
      ), $atts ) );
      //$content = wpb_js_remove_wpautop($content, true); // fix unclosed/unwanted paragraph tags in $content
      $output = "<div data-url_seo='${url_seo}'>${url_seo}</div>";

      

      return $box;
    }

    /*
    Show notice if your plugin is activated but Visual Composer is not
    */
    public function showVcVersionNotice() {
        $plugin_data = get_plugin_data(__FILE__);
        echo '
        <div class="updated">
          <p>'.sprintf(__('<strong>%s</strong> requires <strong><a href="http://bit.ly/vcomposer" target="_blank">Visual Composer</a></strong> plugin to be installed and activated on your site.', 'vc_extend'), $plugin_data['Name']).'</p>
        </div>';
    }
}
// Finally initialize code
new SEOAuditClass();