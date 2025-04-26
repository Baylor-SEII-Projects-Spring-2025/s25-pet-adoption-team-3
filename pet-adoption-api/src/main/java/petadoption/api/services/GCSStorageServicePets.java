package petadoption.api.services;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Service for uploading pet images to Google Cloud Storage (GCS).
 * This service is dedicated to storing photos of pets available for adoption.
 */
@Service
public class GCSStorageServicePets {
    private final String BUCKET_NAME = "adopt_dont_shop_pet_photos";

    /**
     * Uploads a file (pet photo) to Google Cloud Storage with the specified file name.
     *
     * @param file     the multipart file to upload
     * @param fileName the desired file name in the bucket
     * @return the public URL of the uploaded file in GCS
     * @throws IOException if an error occurs during file upload
     */
    public String uploadFile(MultipartFile file, String fileName) throws IOException {
        Storage storage = StorageOptions.getDefaultInstance().getService();

        BlobId blobId = BlobId.of(BUCKET_NAME, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();

        storage.create(blobInfo, file.getBytes());

        return "https://storage.googleapis.com/" + BUCKET_NAME + "/" + fileName;
    }
}
