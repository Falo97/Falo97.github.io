<?php
/** @var \App\Model\Category $category */
/** @var \App\Service\Router $router */

$title = 'Category Details';
ob_start();
?>
    <h1>Category: <?= htmlspecialchars($category->getName() ?? '') ?></h1>
    <p><strong>Description:</strong> <?= htmlspecialchars($category->getDescription() ?? '') ?></p>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('category-edit') ?>&id=<?= $category->getId() ?>">Edit</a></li>
        <li><a href="<?= $router->generatePath('category-index') ?>">Back to list</a></li>
    </ul>
<?php $main = ob_get_clean(); ?>
<?php require __DIR__ . '/../base.html.php'; ?>