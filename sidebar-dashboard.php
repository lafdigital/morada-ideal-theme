<?php
$footer_logo = mi_get_option('mi_footer_logo', false, 'mi_site_info_options');
$user = wp_get_current_user();
$user_id = $user->id;
$user_avatar = get_user_meta($user_id, 'mi_user_avatar', true);
$dashboard_id = mi_get_page_id('dashboard');
$profile_id = mi_get_page_id('profile');
$my_imoveis_id = mi_get_page_id('myimoveis');
$new_imovel_id = mi_get_page_id('editimovel');
$favorites_id = mi_get_page_id('favorites');
$post_id = get_the_ID();
?>
<!-- sidebar dashboard -->
<div class="sidebar-menu-dashboard">
    <a href="<?php echo get_home_url(); ?>" class="logo-box">
        <img src="<?php echo $footer_logo; ?>" alt="">
    </a>
    <div class="user-box">
        <p class="fw-6"><?php _e('Perfil', 'mi'); ?></p>
        <div class="user">
            <?php if (!$user_avatar) { ?>
                <div class="icon-box">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_13487_13661)">
                            <path d="M10.0007 9.99947C10.9357 9.99947 11.8496 9.72222 12.627 9.20278C13.4044 8.68334 14.0103 7.94504 14.3681 7.08124C14.7259 6.21745 14.8196 5.26695 14.6372 4.34995C14.4547 3.43295 14.0045 2.59063 13.3434 1.92951C12.6823 1.26839 11.84 0.81816 10.923 0.635757C10.006 0.453354 9.05546 0.54697 8.19166 0.904766C7.32787 1.26256 6.58957 1.86847 6.07013 2.64586C5.55069 3.42326 5.27344 4.33723 5.27344 5.2722C5.27469 6.52556 5.77314 7.72723 6.65941 8.6135C7.54567 9.49976 8.74734 9.99821 10.0007 9.99947ZM10.0007 2.12068C10.624 2.12068 11.2333 2.30551 11.7516 2.65181C12.2699 2.9981 12.6738 3.4903 12.9123 4.06616C13.1509 4.64203 13.2133 5.27569 13.0917 5.88702C12.9701 6.49836 12.6699 7.05991 12.2292 7.50065C11.7884 7.9414 11.2269 8.24155 10.6155 8.36315C10.0042 8.48476 9.37054 8.42235 8.79468 8.18382C8.21881 7.94528 7.72661 7.54135 7.38032 7.02308C7.03403 6.50482 6.8492 5.89551 6.8492 5.2722C6.8492 4.43636 7.18123 3.63476 7.77225 3.04374C8.36328 2.45271 9.16488 2.12068 10.0007 2.12068Z" fill="white" />
                            <path d="M10.0011 11.5762C8.12108 11.5783 6.31869 12.326 4.98934 13.6554C3.65999 14.9847 2.91224 16.7871 2.91016 18.6671C2.91016 18.876 2.99316 19.0764 3.14092 19.2242C3.28868 19.372 3.48908 19.455 3.69803 19.455C3.90699 19.455 4.10739 19.372 4.25515 19.2242C4.4029 19.0764 4.48591 18.876 4.48591 18.6671C4.48591 17.2044 5.06697 15.8016 6.10126 14.7673C7.13555 13.733 8.53835 13.1519 10.0011 13.1519C11.4638 13.1519 12.8666 13.733 13.9009 14.7673C14.9352 15.8016 15.5162 17.2044 15.5162 18.6671C15.5162 18.876 15.5992 19.0764 15.747 19.2242C15.8947 19.372 16.0951 19.455 16.3041 19.455C16.513 19.455 16.7134 19.372 16.8612 19.2242C17.009 19.0764 17.092 18.876 17.092 18.6671C17.0899 16.7871 16.3421 14.9847 15.0128 13.6554C13.6834 12.326 11.881 11.5783 10.0011 11.5762Z" fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_13487_13661">
                                <rect width="18.9091" height="18.9091" fill="white" transform="translate(0.546875 0.544922)" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            <?php } ?>
            <div class="content">
                <div class="caption-2 text"><?php echo $user->first_name; ?> <?php echo $user->last_name; ?></div>
                <div class="text-white fw-6"><?php echo $user->user_email; ?></div>
                <?php if ($user_avatar) { ?>
                    <img src="<?php echo $user_avatar; ?>" alt="avatar" class="user-avatar img-fluid mw-100 mt-3">
                <?php } ?>
            </div>
        </div>
    </div>
    <div class="menu-box">
        <div class="title fw-6">Menu</div>
        <ul class="box-menu-dashboard">
            <?php if ($dashboard_id) { ?>
                <li class="nav-menu-item <?php echo $post_id === (int)$dashboard_id ? 'active' : ''; ?>">
                    <a class="nav-menu-link" href="<?php echo mi_get_page_url('dashboard'); ?>">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.2">
                                <path d="M6.75682 9.35156V15.64" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M11.0342 6.34375V15.6412" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M15.2412 12.6758V15.6412" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.2939 1.83398H6.70346C3.70902 1.83398 1.83203 3.95339 1.83203 6.95371V15.0476C1.83203 18.0479 3.70029 20.1673 6.70346 20.1673H15.2939C18.2971 20.1673 20.1654 18.0479 20.1654 15.0476V6.95371C20.1654 3.95339 18.2971 1.83398 15.2939 1.83398Z" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                        </svg>
                        <?php echo get_the_title($dashboard_id); ?>
                    </a>
                </li>
            <?php } ?>

            <?php if ($profile_id) { ?>
                <li class="nav-menu-item <?php echo $post_id === (int)$profile_id ? 'active' : ''; ?>">
                    <a class="nav-menu-link" href="<?php echo mi_get_page_url('profile'); ?>">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.2">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.987 14.0684C7.44168 14.0684 4.41406 14.6044 4.41406 16.7511C4.41406 18.8979 7.42247 19.4531 10.987 19.4531C14.5323 19.4531 17.5591 18.9162 17.5591 16.7703C17.5591 14.6245 14.5515 14.0684 10.987 14.0684Z" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9866 11.0056C13.3132 11.0056 15.1989 9.11897 15.1989 6.79238C15.1989 4.46579 13.3132 2.58008 10.9866 2.58008C8.66005 2.58008 6.77346 4.46579 6.77346 6.79238C6.7656 9.11111 8.6391 10.9977 10.957 11.0056H10.9866Z" stroke="#F1FAEE" stroke-width="1.42857" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                        </svg>
                        <?php echo get_the_title($profile_id); ?>
                    </a>
                </li>
            <?php } ?>

            <!-- <li class="nav-menu-item">
                <a class="nav-menu-link" href="reviews.html">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.2">
                            <path d="M16.4076 8.11328L12.3346 11.4252C11.5651 12.0357 10.4824 12.0357 9.71285 11.4252L5.60547 8.11328" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4985 19.25C18.2864 19.2577 20.1654 16.9671 20.1654 14.1518V7.85584C20.1654 5.04059 18.2864 2.75 15.4985 2.75H6.49891C3.711 2.75 1.83203 5.04059 1.83203 7.85584V14.1518C1.83203 16.9671 3.711 19.2577 6.49891 19.25H15.4985Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                    </svg>
                    Reviews
                </a>
            </li> -->

            <!-- <li class="nav-menu-item">
                <a class="nav-menu-link" href="message.html">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.2">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.4808 17.4814C14.6793 20.2831 10.531 20.8885 7.13625 19.3185C6.6351 19.1167 6.22423 18.9537 5.83362 18.9537C4.74565 18.9601 3.39143 20.015 2.68761 19.3121C1.98379 18.6082 3.03952 17.2529 3.03952 16.1583C3.03952 15.7677 2.88291 15.3641 2.68116 14.862C1.11046 11.4678 1.71663 7.31811 4.5181 4.51726C8.09433 0.939714 13.9045 0.939714 17.4808 4.51634C21.0635 8.09941 21.057 13.9047 17.4808 17.4814Z" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14.6105 11.3802H14.6187" stroke="#F1FAEE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.9347 11.3802H10.9429" stroke="#F1FAEE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7.2589 11.3802H7.26715" stroke="#F1FAEE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                    </svg>  
                    Message
                </a>
            </li> -->

            <?php if ($my_imoveis_id) { ?>
                <li class="nav-menu-item <?php echo $post_id === (int)$my_imoveis_id ? 'active' : ''; ?>">
                    <a class="nav-menu-link" href="<?php echo mi_get_page_url('myimoveis'); ?>">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.2">
                                <path d="M10.533 2.55664H7.10561C4.28686 2.55664 2.51953 4.55222 2.51953 7.37739V14.9986C2.51953 17.8237 4.27861 19.8193 7.10561 19.8193H15.1943C18.0222 19.8193 19.7813 17.8237 19.7813 14.9986V11.3062" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.09012 10.0111L14.9404 3.16086C15.7938 2.30836 17.177 2.30836 18.0305 3.16086L19.146 4.27644C19.9995 5.12986 19.9995 6.51403 19.146 7.36653L12.2628 14.2498C11.8897 14.6229 11.3837 14.8328 10.8557 14.8328H7.42188L7.50804 11.3678C7.52087 10.8581 7.72896 10.3723 8.09012 10.0111Z" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13.8984 4.21875L18.0839 8.40425" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                        </svg>
                        <?php echo get_the_title($my_imoveis_id); ?>
                    </a>
                </li>
            <?php } ?>

            <?php if ($favorites_id) { ?>
                <li class="nav-menu-item <?php echo $post_id === (int)$favorites_id ? 'active' : ''; ?>">
                    <a class="nav-menu-link" href="<?php echo mi_get_page_url('favorites'); ?>">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.2">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2.63385 10.6318C1.65026 7.56096 2.79976 4.05104 6.02368 3.01246C7.71951 2.46521 9.59135 2.78788 11.0012 3.84846C12.3349 2.81721 14.2755 2.46888 15.9695 3.01246C19.1934 4.05104 20.3503 7.56096 19.3676 10.6318C17.8368 15.4993 11.0012 19.2485 11.0012 19.2485C11.0012 19.2485 4.21601 15.5561 2.63385 10.6318Z" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M14.668 6.14258C15.6488 6.45974 16.3418 7.33516 16.4252 8.36274" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                        </svg>
                        <?php echo get_the_title($favorites_id); ?>
                    </a>
                </li>
            <?php } ?>

            <!-- <li class="nav-menu-item">
                <a class="nav-menu-link" href="save-search.html">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.2">
                        <circle cx="10.7864" cy="10.7864" r="8.23951" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16.5156 16.9453L19.746 20.1673" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                    </svg>
                    Save search
                </a>
            </li> -->

            <!-- <li class="nav-menu-item">
                <a class="nav-menu-link" href="message.html">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.2">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M17.4808 17.4814C14.6793 20.2831 10.531 20.8885 7.13625 19.3185C6.6351 19.1167 6.22423 18.9537 5.83362 18.9537C4.74565 18.9601 3.39143 20.015 2.68761 19.3121C1.98379 18.6082 3.03952 17.2529 3.03952 16.1583C3.03952 15.7677 2.88291 15.3641 2.68116 14.862C1.11046 11.4678 1.71663 7.31811 4.5181 4.51726C8.09433 0.939714 13.9045 0.939714 17.4808 4.51634C21.0635 8.09941 21.057 13.9047 17.4808 17.4814Z" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14.6105 11.3802H14.6187" stroke="#F1FAEE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10.9347 11.3802H10.9429" stroke="#F1FAEE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7.2589 11.3802H7.26715" stroke="#F1FAEE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                    </svg>
                    Message
                </a>
            </li> -->

            <?php if ($new_imovel_id) { ?>
                <li class="nav-menu-item <?php echo $post_id === (int)$new_imovel_id ? 'active' : ''; ?>">
                    <a class="nav-menu-link" href="<?php echo mi_get_page_url('editimovel'); ?><?php echo isset($_GET['imovel_id']) && $_GET['imovel_id'] ? '?imovel_id=' . $_GET['imovel_id'] : ''; ?>">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.2">
                                <path d="M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM19.5 19.5H4.5V4.5H19.5V19.5ZM16.5 12C16.5 12.1989 16.421 12.3897 16.2803 12.5303C16.1397 12.671 15.9489 12.75 15.75 12.75H12.75V15.75C12.75 15.9489 12.671 16.1397 12.5303 16.2803C12.3897 16.421 12.1989 16.5 12 16.5C11.8011 16.5 11.6103 16.421 11.4697 16.2803C11.329 16.1397 11.25 15.9489 11.25 15.75V12.75H8.25C8.05109 12.75 7.86032 12.671 7.71967 12.5303C7.57902 12.3897 7.5 12.1989 7.5 12C7.5 11.8011 7.57902 11.6103 7.71967 11.4697C7.86032 11.329 8.05109 11.25 8.25 11.25H11.25V8.25C11.25 8.05109 11.329 7.86032 11.4697 7.71967C11.6103 7.57902 11.8011 7.5 12 7.5C12.1989 7.5 12.3897 7.57902 12.5303 7.71967C12.671 7.86032 12.75 8.05109 12.75 8.25V11.25H15.75C15.9489 11.25 16.1397 11.329 16.2803 11.4697C16.421 11.6103 16.5 11.8011 16.5 12Z" fill="#F1FAEE"></path>
                            </g>
                        </svg>

                        <?php echo isset($_GET['imovel_id']) && $_GET['imovel_id'] ? __('Editar Imóvel', 'mi') : __('Novo Imóvel', 'mi'); ?>
                    </a>
                </li>
            <?php } ?>

            <li class="nav-menu-item">
                <a class="nav-menu-link" href="<?php echo wp_logout_url(get_permalink()); ?>">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.2">
                            <path d="M13.7627 6.77418V5.91893C13.7627 4.05352 12.2502 2.54102 10.3848 2.54102H5.91606C4.05156 2.54102 2.53906 4.05352 2.53906 5.91893V16.1214C2.53906 17.9868 4.05156 19.4993 5.91606 19.4993H10.394C12.2539 19.4993 13.7627 17.9914 13.7627 16.1315V15.2671" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M19.9907 11.0208H8.95312" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M17.3047 8.34766L19.9887 11.0197L17.3047 13.6927" stroke="#F1FAEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                    </svg>
                    <?php _e('Sair', 'mi'); ?>
                </a>
            </li>
        </ul>
    </div>

</div>
<!-- end sidebar dashboard -->