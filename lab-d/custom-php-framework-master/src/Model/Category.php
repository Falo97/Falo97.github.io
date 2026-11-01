<?php
namespace App\Model;

use App\Service\Config;
use PDO;

class Category
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public static function fromArray(array $array): self
    {
        $category = new self();
        $category->fill($array);
        return $category;
    }

    public function fill(array $array): self
    {
        if (isset($array['id'])) {
            $this->setId((int) $array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new PDO(Config::get('db_dsn'));
        $sql = 'SELECT * FROM category';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $categories = [];
        $categoriesArray = $statement->fetchAll(PDO::FETCH_ASSOC);
        foreach ($categoriesArray as $categoryArray) {
            $categories[] = self::fromArray($categoryArray);
        }

        return $categories;
    }

    public static function find(int $id): ?self
    {
        $pdo = new PDO(Config::get('db_dsn'));
        $sql = 'SELECT * FROM category WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute([':id' => $id]);

        $categoryArray = $statement->fetch(PDO::FETCH_ASSOC);
        if (! $categoryArray) {
            return null;
        }

        return self::fromArray($categoryArray);
    }

    public function save(): void
    {
        $pdo = new PDO(Config::get('db_dsn'));

        if ($this->getId()) {
            $sql = 'UPDATE category SET name = :name, description = :description WHERE id = :id';
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':description' => $this->getDescription(),
                ':id' => $this->getId(),
            ]);
        } else {
            $sql = 'INSERT INTO category (name, description) VALUES (:name, :description)';
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':description' => $this->getDescription(),
            ]);
            $this->setId((int) $pdo->lastInsertId());
        }
    }

    public function delete(): void
    {
        $pdo = new PDO(Config::get('db_dsn'));
        $sql = 'DELETE FROM category WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute([':id' => $this->getId()]);
    }
}