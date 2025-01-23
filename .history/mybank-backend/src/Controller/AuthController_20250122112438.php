<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Service\JWTService;

class AuthController extends AbstractController
{
    /**
     * @Route("/api/login", name="login", methods={"POST"})
     */
    public function login(Request $request, JWTService $jwtService)
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'];
        $password = $data['password'];

        // Logique de vérification des identifiants de l'utilisateur

        // Si l'utilisateur est authentifié, générer un JWT
        $token = $jwtService->generateToken($email);

        return new JsonResponse(['token' => $token]);
    }
}
