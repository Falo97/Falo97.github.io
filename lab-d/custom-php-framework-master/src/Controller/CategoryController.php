<?php
namespace App\Controller;

use App\Model\Category;
use App\Service\Router;
use App\Service\Templating;

class CategoryController
{
    public function indexAction(Templating $templating, Router $router): string
    {
        $categories = Category::findAll();
        return $templating->render('category/index.html.php', [
            'categories' => $categories,
            'router' => $router,
        ]);
    }

    public function createAction(?array $categoryData, Templating $templating, Router $router): string
    {
        if ($categoryData) {
            $category = Category::fromArray($categoryData);
            $category->save();
            $path = $router->generatePath('category-index');
            $router->redirect($path);
            return '';
        }

        $category = new Category();
        return $templating->render('category/create.html.php', [
            'category' => $category,
            'router' => $router,
        ]);
    }

    public function editAction(int $id, ?array $categoryData, Templating $templating, Router $router): string
    {
        $category = Category::find($id);
        if (!$category) {
            throw new \Exception("Category with id $id not found");
        }

        if ($categoryData) {
            $category->fill($categoryData);
            $category->save();
            $path = $router->generatePath('category-index');
            $router->redirect($path);
            return '';
        }

        return $templating->render('category/edit.html.php', [
            'category' => $category,
            'router' => $router,
        ]);
    }

    public function showAction(int $id, Templating $templating, Router $router): string
    {
        $category = Category::find($id);
        if (!$category) {
            throw new \Exception("Category with id $id not found");
        }

        return $templating->render('category/show.html.php', [
            'category' => $category,
            'router' => $router,
        ]);
    }

    public function deleteAction(int $id, Router $router): string
    {
        $category = Category::find($id);
        if ($category) {
            $category->delete();
        }

        $path = $router->generatePath('category-index');
        $router->redirect($path);
        return '';
    }
}