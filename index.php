<?php

/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 * Learn more: https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package morada-ideal
 */

get_header(); ?>

<?php

if (have_posts()) {
    // Load posts loop.
    while (have_posts()) {
        the_post();
        //get_template_part('template-parts/content/content');
    }
} else {
    // If no content, include the "No posts found" template.
    //get_template_part('template-parts/content/content-none');
}
get_footer();
