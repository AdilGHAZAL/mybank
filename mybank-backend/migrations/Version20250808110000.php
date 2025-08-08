<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250808110000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add User entity and user relationships to Operation and Category tables';
    }

    public function up(Schema $schema): void
    {
        // Create user table first
        $this->addSql('CREATE TABLE `user` (
            id INT AUTO_INCREMENT NOT NULL, 
            email VARCHAR(180) NOT NULL, 
            roles JSON NOT NULL, 
            password VARCHAR(255) NOT NULL, 
            first_name VARCHAR(100) NOT NULL, 
            last_name VARCHAR(100) NOT NULL, 
            created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', 
            UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), 
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        // Create a default user for existing data
        $this->addSql("INSERT INTO `user` (email, roles, password, first_name, last_name, created_at) VALUES 
            ('admin@mybank.com', '[\"ROLE_USER\"]', '\$2y\$13\$defaulthashedpassword', 'Admin', 'User', NOW())");

        // Add user_id columns as nullable first
        $this->addSql('ALTER TABLE operation ADD user_id INT NULL');
        $this->addSql('ALTER TABLE category ADD user_id INT NULL');

        // Update existing records to use the default user
        $this->addSql('UPDATE operation SET user_id = 1 WHERE user_id IS NULL');
        $this->addSql('UPDATE category SET user_id = 1 WHERE user_id IS NULL');

        // Now make the columns NOT NULL and add foreign key constraints
        $this->addSql('ALTER TABLE operation MODIFY user_id INT NOT NULL');
        $this->addSql('ALTER TABLE operation ADD CONSTRAINT FK_1981A66DA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('CREATE INDEX IDX_1981A66DA76ED395 ON operation (user_id)');

        $this->addSql('ALTER TABLE category MODIFY user_id INT NOT NULL');
        $this->addSql('ALTER TABLE category ADD CONSTRAINT FK_64C19C1A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('CREATE INDEX IDX_64C19C1A76ED395 ON category (user_id)');
    }

    public function down(Schema $schema): void
    {
        // Remove foreign key constraints
        $this->addSql('ALTER TABLE operation DROP FOREIGN KEY FK_1981A66DA76ED395');
        $this->addSql('DROP INDEX IDX_1981A66DA76ED395 ON operation');
        $this->addSql('ALTER TABLE operation DROP user_id');

        $this->addSql('ALTER TABLE category DROP FOREIGN KEY FK_64C19C1A76ED395');
        $this->addSql('DROP INDEX IDX_64C19C1A76ED395 ON category');
        $this->addSql('ALTER TABLE category DROP user_id');

        // Drop user table
        $this->addSql('DROP TABLE `user`');
    }
}
