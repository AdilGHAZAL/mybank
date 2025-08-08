<?php

namespace App\Controller;

use App\Entity\Operation;
use App\Entity\Category;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\SerializerInterface;

class OperationController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private SerializerInterface $serializer;

    public function __construct(EntityManagerInterface $entityManager, SerializerInterface $serializer)
    {
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
    }

    // Removed custom createOperation method - using API Platform's auto-generated endpoint instead

    #[Route('/api/operations', name: 'get_operations', methods: ['GET'])]
    public function getOperations(): JsonResponse
    {
        // Get current authenticated user
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
        }
        
        // Only get operations belonging to the current user
        $operations = $this->entityManager->getRepository(Operation::class)
            ->findBy(['user' => $user], ['date' => 'DESC']);
        $data = $this->serializer->serialize($operations, 'json', ['groups' => ['operation:read']]);
        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }

    #[Route('/api/operations/{id}', name: 'get_operation', methods: ['GET'])]
    public function getOperation(int $id): JsonResponse
    {
        // Get current authenticated user
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
        }
        
        // Only get operation if it belongs to the current user
        $operation = $this->entityManager->getRepository(Operation::class)
            ->findOneBy(['id' => $id, 'user' => $user]);
        
        if (!$operation) {
            return new JsonResponse(['error' => 'Operation not found or access denied'], JsonResponse::HTTP_NOT_FOUND);
        }
        
        $data = $this->serializer->serialize($operation, 'json', ['groups' => ['operation:read']]);
        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }

    #[Route('/api/operations/{id}', name: 'update_operation', methods: ['PUT'])]
    public function updateOperation(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $operation = $this->entityManager->getRepository(Operation::class)->find($id);

        if (!$operation) {
            return new JsonResponse(['error' => 'Operation not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Find the category if provided
        if (isset($data['category'])) {
            $category = $this->entityManager->getRepository(Category::class)->find($data['category']);
            if (!$category) {
                return new JsonResponse(['error' => 'Category not found'], JsonResponse::HTTP_BAD_REQUEST);
            }
            $operation->setCategory($category);
        }

        if (isset($data['label'])) {
            $operation->setLabel($data['label']);
        }
        if (isset($data['amount'])) {
            $operation->setAmount($data['amount']);
        }
        if (isset($data['date'])) {
            $operation->setDate(new \DateTime($data['date']));
        }

        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Operation updated successfully']);
    }

    #[Route('/api/operations/{id}', name: 'delete_operation', methods: ['DELETE'])]
    public function deleteOperation(int $id): JsonResponse
    {
        $operation = $this->entityManager->getRepository(Operation::class)->find($id);

        if (!$operation) {
            return new JsonResponse(['error' => 'Operation not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($operation);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Operation deleted successfully']);
    }
}
