<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\User;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class CategoryController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private SerializerInterface $serializer;
    private CategoryRepository $categoryRepository;
    private ValidatorInterface $validator;

    public function __construct(EntityManagerInterface $entityManager, SerializerInterface $serializer, CategoryRepository $categoryRepository, ValidatorInterface $validator)
    {
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
        $this->categoryRepository = $categoryRepository;
        $this->validator = $validator;
    }

    #[Route('/api/categories', name: 'get_categories', methods: ['GET'])]
    public function getCategories(): JsonResponse
    {
        // TEMPORARY: Return all categories for testing (bypass authentication)
        $categories = $this->categoryRepository->findAll();
        $data = $this->serializer->serialize($categories, 'json', ['groups' => ['category:read']]);
        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }

    #[Route('/api/categories/{id}', name: 'get_category', methods: ['GET'])]
    public function getCategory(int $id): JsonResponse
    {
        $category = $this->categoryRepository->find($id);
        
        if (!$category) {
            return new JsonResponse(['error' => 'Category not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        
        // Check if category belongs to current user
        $user = $this->getUser();
        if (!$user instanceof User || $category->getUser() !== $user) {
            return new JsonResponse(['error' => 'Category not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        
        $data = $this->serializer->serialize($category, 'json', ['groups' => ['category:read']]);
        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }

    #[Route('/api/categories', name: 'create_category', methods: ['POST'])]
    public function createCategory(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return new JsonResponse(['error' => 'Invalid JSON'], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Get current authenticated user
            $user = $this->getUser();
            if (!$user instanceof User) {
                return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
            }

            $category = new Category();
            $category->setTitle($data['title']);
            $category->setUser($user); // Associate with current user

            // Validate the category
            $errors = $this->validator->validate($category);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                return new JsonResponse(['errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
            }

            $this->entityManager->persist($category);
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Category created successfully',
                'id' => $category->getId()
            ], JsonResponse::HTTP_CREATED);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Failed to create category: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/categories/{id}', name: 'update_category', methods: ['PUT'])]
    public function updateCategory(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $category = $this->categoryRepository->find($id);

        if (!$category) {
            return new JsonResponse(['error' => 'Category not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Check if category belongs to current user
        $user = $this->getUser();
        if (!$user instanceof User || $category->getUser() !== $user) {
            return new JsonResponse(['error' => 'Category not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        if (isset($data['title'])) {
            $category->setTitle($data['title']);
        }

        // Validate the category
        $errors = $this->validator->validate($category);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Category updated successfully']);
    }

    #[Route('/api/categories/{id}', name: 'delete_category', methods: ['DELETE'])]
    public function deleteCategory(int $id): JsonResponse
    {
        $category = $this->entityManager->getRepository(Category::class)->find($id);

        if (!$category) {
            return new JsonResponse(['error' => 'Category not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Check if category has operations
        if ($category->getOperations()->count() > 0) {
            return new JsonResponse([
                'error' => 'Cannot delete category with existing operations'
            ], JsonResponse::HTTP_CONFLICT);
        }

        $this->entityManager->remove($category);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Category deleted successfully !!']);
    }
}
