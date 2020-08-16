<?php

if (!defined('ABSPATH')) {
    exit;
} // Exit if accessed directly

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group([
        'key'    => 'group_5bef00e4daa6e',
        'title'  => 'Project detail',
        'fields' => [
            [
                'key'               => 'field_5befd1f77efce',
                'label'             => 'Project locatie',
                'name'              => 'project_locatie',
                'type'              => 'taxonomy',
                'instructions'      => '',
                'required'          => 0,
                'conditional_logic' => 0,
                'wrapper'           => [
                    'width' => '',
                    'class' => '',
                    'id'    => '',
                ],
                'taxonomy'      => 'project_locatie',
                'field_type'    => 'radio',
                'allow_null'    => 0,
                'add_term'      => 1,
                'save_terms'    => 1,
                'load_terms'    => 1,
                'return_format' => 'id',
                'multiple'      => 0,
        ],
        [
            'key'               => 'field_5bef01bbb667a',
            'label'             => 'Project date start',
            'name'              => 'project_date_start',
            'type'              => 'taxonomy',
            'instructions'      => '',
            'required'          => 0,
            'conditional_logic' => 0,
            'wrapper'           => [
                'width' => '',
                'class' => '',
                'id'    => '',
            ],
            'taxonomy'      => 'project_date_start',
            'field_type'    => 'radio',
            'allow_null'    => 0,
            'add_term'      => 1,
            'save_terms'    => 1,
            'load_terms'    => 1,
            'return_format' => 'id',
            'multiple'      => 0,
        ],
        [
            'key'               => 'field_5bef03e6414d0',
            'label'             => 'Project date finish',
            'name'              => 'project_date_finish',
            'type'              => 'taxonomy',
            'instructions'      => '',
            'required'          => 0,
            'conditional_logic' => 0,
            'wrapper'           => [
                'width' => '',
                'class' => '',
                'id'    => '',
            ],
            'taxonomy'      => 'project_date_finish',
            'field_type'    => 'radio',
            'allow_null'    => 0,
            'add_term'      => 1,
            'save_terms'    => 1,
            'load_terms'    => 1,
            'return_format' => 'id',
            'multiple'      => 0,
        ],
    ],
    'location' => [
        [
            [
                'param'    => 'post_type',
                'operator' => '==',
                'value'    => 'project',
            ],
        ],
    ],
    'menu_order'            => 0,
    'position'              => 'normal',
    'style'                 => 'default',
    'label_placement'       => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen'        => '',
    'active'                => 1,
    'description'           => '',
]);
}
