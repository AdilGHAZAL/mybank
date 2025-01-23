<?php

// src/Entity/Operation.php
namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: OperationRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['operation:read']],
    denormalizationContext: ['groups' => ['operation:write']],
)]
class Operation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['operation:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['operation:read', 'operation:write'])]
    private ?string $label = null;

    #[ORM\Column]
    #[Groups(['operation:read', 'operation:write'])]
    private ?float $amount = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['operation:read', 'operation:write'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(length: 255)]
    #[Groups(['operation:read', 'operation:write'])]
    private ?string $category = null;

    // Getters and setters...
}