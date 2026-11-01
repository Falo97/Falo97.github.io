<?php
/** @var \App\Model\Category[] $categories */
$mainClass = 'category-index';
$title = 'Categories List';

$main = '<h1>Categories List</h1><ul class="index-list">';
foreach ($categories as $category) {
    $main .= '<li><h3>' . htmlspecialchars($category->getName() ?? '') . '</h3>';
    $main .= '<ul class="action-list">';
    $main .= '<li><a href="?action=category-show&id=' . $category->getId() . '">Details</a></li>';
    $main .= '<li><a href="?action=category-edit&id=' . $category->getId() . '">Edit</a></li>';
    $main .= '<li><a href="?action=category-delete&id=' . $category->getId() . '" onclick="return confirm(\'Na pewno usunąć?\')">Delete</a></li>';
    $main .= '</ul></li>';
}
$main .= '</ul>';

$main .= '<p><a href="?action=category-create">Create new category</a></p>';

require __DIR__ . '/../base.html.php';