<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Operation;
use App\Entity\Category;
use App\Entity\User;
use PHPUnit\Framework\TestCase;

class OperationTest extends TestCase
{
    public function testOperationCreation(): void
    {
        $operation = new Operation();
        $operation->setAmount(100.50);
        $operation->setLabel('Test expense');
        $operation->setDate(new \DateTime());
        
        $this->assertEquals(100.50, $operation->getAmount());
        $this->assertEquals('Test expense', $operation->getLabel());
        $this->assertInstanceOf(\DateTimeInterface::class, $operation->getDate());
    }

    public function testOperationWithCategory(): void
    {
        $category = new Category();
        $category->setTitle('Food');
        
        $operation = new Operation();
        $operation->setCategory($category);
        
        $this->assertEquals('Food', $operation->getCategory()->getTitle());
    }

    public function testOperationWithUser(): void
    {
        $user = new User();
        $user->setEmail('test@example.com');
        
        $operation = new Operation();
        $operation->setUser($user);
        
        $this->assertEquals('test@example.com', $operation->getUser()->getEmail());
    }
}
