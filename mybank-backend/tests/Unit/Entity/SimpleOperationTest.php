<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Operation;
use App\Entity\Category;
use App\Entity\User;
use PHPUnit\Framework\TestCase;

class SimpleOperationTest extends TestCase
{
    public function testOperationBasics(): void
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
}
