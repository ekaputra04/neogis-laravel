<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class StreetController extends Controller
{
    public function overviewStreet()
    {


        return Inertia::render('MapOverviewStreet');
    }

    public function overviewLocation()
    {
        return Inertia::render('StreetLocation');
    }

    public function addStreet()
    {
        return Inertia::render('MapAddStreet',);
    }

    public function editStreet($id)
    {
        return Inertia::render('MapEditStreet', [
            'id' => $id,
        ]);
    }
}
