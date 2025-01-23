<?php

// src/Controller/OperationController.php
namespace App\Controller;

use App\Entity\Operation;
use App\Repository\OperationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/operations', name: 'api_operations_')]
class OperationController extends AbstractController
{
    private $operationRepository;
    private $entityManager;
    private $serializer;

    public function __construct(
        OperationRepository $operationRepository,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer
    ) {
        $this->operationRepository = $operationRepository;
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
    }

    // Fetch all operations
    #[Route('/', name: 'list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $operations = $this->operationRepository->findAll();
        $data = $this->serializer->serialize($operations, 'json', ['groups' => 'operation:read']);
        return new JsonResponse($data, 200, [], true);
    }

    // Fetch a single operation by ID
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Operation $operation): JsonResponse
    {
        $data = $this->serializer->serialize($operation, 'json', ['groups' => 'operation:read']);
        return new JsonResponse($data, 200, [], true);
    }

    // Create a new operation
    #[Route('/', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $operation = new Operation();
        $operation->setLabel($data['label']);
        $operation->setAmount($data['amount']);
        $operation->setDate(new \DateTime($data['date']));
        $operation->setCategory($data['category']);

        $this->entityManager->persist($operation);
        $this->entityManager->flush();

        $data = $this->serializer->serialize($operation, 'json', ['groups' => 'operation:read']);
        return new JsonResponse($data, 201, [], true);
    }

    // Update an operation
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(Operation $operation, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $operation->setLabel($data['label'] ?? $operation->getLabel());
        $operation->setAmount($data['amount'] ?? $operation->getAmount());
        $operation->setDate(new \DateTime($data['date'] ?? $operation->getDate()->format('Y-m-d')));
        $operation->setCategory($data['category'] ?? $operation->getCategory());

        $this->entityManager->flush();

        $data = $this->serializer->serialize($operation, 'json', ['groups' => 'operation:read']);
        return new JsonResponse($data, 200, [], true);
    }

    // Delete an operation
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Operation $operation): JsonResponse
    {
        $this->entityManager->remove($operation);
        $this->entityManager->flush();

        return new JsonResponse(null, 204);
    }
}