<?php

namespace App\Core\Media;

use Spatie\MediaLibrary\Support\UrlGenerator\DefaultUrlGenerator;

/**
 * cloudinary-labs/cloudinary-laravel's Flysystem adapter implements
 * getUrl() by calling Cloudinary's Admin API (a live HTTP round-trip) just
 * to read back the asset's own secure_url. Since Spatie's DefaultUrlGenerator
 * calls exactly that on every Media::getUrl()/getFirstMediaUrl() - i.e.
 * every image, on every property list/detail response - that would mean N
 * live Cloudinary Admin API calls per request: slow, and quick to exhaust
 * Cloudinary's (much stricter) Admin API rate limit compared to its CDN.
 *
 * Cloudinary delivery URLs are fully predictable from the cloud name and
 * public_id alone, so this builds them directly (zero network calls)
 * instead, applying f_auto/q_auto so Cloudinary still picks the best
 * format/compression per-request at the CDN edge.
 */
class CloudinaryUrlGenerator extends DefaultUrlGenerator
{
    public function getUrl(): string
    {
        if ($this->getDiskName() !== 'cloudinary') {
            return parent::getUrl();
        }

        // Mirrors CloudinaryStorageAdapter::prepareResource()'s public_id
        // derivation exactly, so reads resolve the same path writes used -
        // strip the extension (Cloudinary's image public_ids are
        // extension-less; format is negotiated at delivery time).
        $publicId = preg_replace('/\.[^.\/]+$/', '', $this->getPathRelativeToRoot());
        $cloudName = config('filesystems.disks.cloudinary.cloud');

        return "https://res.cloudinary.com/{$cloudName}/image/upload/f_auto,q_auto/{$publicId}";
    }
}
