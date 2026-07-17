<?php

namespace App\Modules\Lead\Domain\Enums;

enum LeadStatus: string
{
    case New = 'new';
    case Contacted = 'contacted';
    case Closed = 'closed';
}
