<?php

namespace App\Controller;

use App\Entity\Operation;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class OperationController extends AbstractController
{
    /**
     * @Route("/api/operations", name="create_operation", methods={"POST"})
     */
    public function createOperation(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $operation = new Operation();
        $operation->setDescription($data['description']);
        $operation->setAmount($data['amount']);
        $operation->setDate(new \DateTime($data['date']));
        $operation->setCategory($data['category']); // Catégorie associée

        // Sauvegarde en base de données
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($operation);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Operation created', 'id' => $operation->getId()]);
    }

    /**
     * @Route("/api/operations", name="get_operations", methods={"GET"})
     */
    public function getOperations()
    {
        $operations = $this->getDoctrine()->getRepository(Operation::class)->findAll();
        return new JsonResponse($operations);
    }

    /**
     * @Route("/api/operations/{id}", name="get_operation", methods={"GET"})
     */
    public function getOperation($id)
    {
        $operation = $this->getDoctrine()->getRepository(Operation::class)->find($id);
        return $operation ? new JsonResponse($operation) : new JsonResponse(['message' => 'Not found'], JsonResponse::HTTP_NOT_FOUND);
    }

    /**
     * @Route("/api/operations/{id}", name="update_operation", methods={"PUT"})
     */
    public function updateOperation($id, Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $operation = $this->getDoctrine()->getRepository(Operation::class)->find($id);

        if (!$operation) {
            return new JsonResponse(['message' => 'Operation not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $operation->setDescription($data['description']);
        $operation->setAmount($data['amount']);
        $operation->setDate(new \DateTime($data['date']));
        $operation->setCategory($data['category']); // Mise à jour de la catégorie

        $this->getDoctrine()->getManager()->flush();

        return new JsonResponse(['message' => 'Operation updated']);
    }

    /**
     * @Route("/api/operations/{id}", name="delete_operation", methods={"DELETE"})
     */
    public function deleteOperation($id)
    {
        $operation = $this->getDoctrine()->getRepository(Operation::class)->find($id);

        if (!$operation) {
            return new JsonResponse(['message' => 'Operation not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($operation);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Operation deleted']);
    }
}
