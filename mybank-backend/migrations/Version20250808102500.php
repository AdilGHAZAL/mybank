<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration to update Operation entity structure and add Category relationship
 */
final class Version20250808102500 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Update Operation entity: rename description to label and add category relationship';
    }

    public function up(Schema $schema): void
    {
        // Create category table if it doesn't exist
        $this->addSql('CREATE TABLE IF NOT EXISTS category (
            id INT AUTO_INCREMENT NOT NULL, 
            title VARCHAR(255) NOT NULL, 
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        // Add some default categories
        $this->addSql("INSERT IGNORE INTO category (title) VALUES 
            ('Food & Dining'),
            ('Transportation'), 
            ('Shopping'),
            ('Entertainment'),
            ('Bills & Utilities'),
            ('Healthcare'),
            ('Other')");

        // Add category_id column to operation table
        $this->addSql('ALTER TABLE operation ADD COLUMN category_id INT DEFAULT NULL');
        
        // Rename description to label in operation table
        $this->addSql('ALTER TABLE operation CHANGE description label VARCHAR(255) NOT NULL');
        
        // Set default category for existing operations (first category)
        $this->addSql('UPDATE operation SET category_id = (SELECT id FROM category LIMIT 1) WHERE category_id IS NULL');
        
        // Make category_id NOT NULL and add foreign key constraint
        $this->addSql('ALTER TABLE operation MODIFY category_id INT NOT NULL');
        $this->addSql('ALTER TABLE operation ADD CONSTRAINT FK_1981A66D12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('CREATE INDEX IDX_1981A66D12469DE2 ON operation (category_id)');
    }

    public function down(Schema $schema): void
    {
        // Remove foreign key constraint and index
        $this->addSql('ALTER TABLE operation DROP FOREIGN KEY FK_1981A66D12469DE2');
        $this->addSql('DROP INDEX IDX_1981A66D12469DE2 ON operation');
        
        // Remove category_id column
        $this->addSql('ALTER TABLE operation DROP COLUMN category_id');
        
        // Rename label back to description
        $this->addSql('ALTER TABLE operation CHANGE label description VARCHAR(255) NOT NULL');
        
        // Drop category table
        $this->addSql('DROP TABLE category');
    }
}
