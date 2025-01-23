// src/Controller/OperationController.php
namespace App\Controller;

use App\Entity\Operation;
use App\Repository\OperationRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class OperationController extends AbstractController
{
    /**
     * @Route("/api/operations", name="get_operations", methods={"GET"})
     */
    public function getOperations(OperationRepository $operationRepository)
    {
        $operations = $operationRepository->findAll();
        return new JsonResponse($operations);
    }

    /**
     * @Route("/api/operations/{id}", name="get_operation", methods={"GET"})
     */
    public function getOperation($id, OperationRepository $operationRepository)
    {
        $operation = $operationRepository->find($id);
        if (!$operation) {
            return new JsonResponse(['message' => 'Operation not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        return new JsonResponse($operation);
    }
}
