<?php

namespace App\Entity;

use App\Repository\OperationRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: OperationRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['operation:read']],
    denormalizationContext: ['groups' => ['operation:write']]
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

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    #[Groups(['operation:read', 'operation:write'])]
    private ?float $amount = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['operation:read', 'operation:write'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'operations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['operation:read', 'operation:write'])]
    private ?Category $category = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'operations')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['operation:read'])]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
}
