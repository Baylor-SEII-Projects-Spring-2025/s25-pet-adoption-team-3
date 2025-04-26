package petadoption.api.services;

import com.google.cloud.storage.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

/**
 * Service for uploading files to Google Cloud Storage (GCS) for profile photos and related resources.
 */
@Service
public class GCSStorageService {
    private final String BUCKET_NAME = "ads_profile_photo";

    /**
     * Uploads a file to Google Cloud Storage under the specified file name.
     *
     * @param file     the multipart file to be uploaded
     * @param fileName the name to use for the stored file in GCS
     * @return the public URL of the uploaded file in GCS
     * @throws IOException if file upload fails
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
