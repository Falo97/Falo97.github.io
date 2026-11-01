<?php
/** @var \App\Model\Category $category */
/** @var \App\Service\Router $router */

$mainClass = 'category-create';
$title = 'Create Category';
?>

<?php ob_start(); ?>

    <h1>Create Category</h1>

    <form action="<?= $router->generatePath('category-create') ?>" method="post">
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="category[name]" value="<?= htmlspecialchars($category->getName() ?? '') ?>">
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="category[description]"><?= htmlspecialchars($category->getDescription() ?? '') ?></textarea>
        </div>

        <div class="form-group">
            <input type="submit" value="Create">
        </div>
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('category-index') ?>">Back to list</a>
        </li>
    </ul>

<?php $main = ob_get_clean(); ?>

<?php require __DIR__ . '/../base.html.php'; ?>