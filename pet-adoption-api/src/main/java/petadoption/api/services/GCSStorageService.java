package petadoption.api.services;

import com.google.cloud.storage.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class GCSStorageService {
    private final String BUCKET_NAME = "ads_profile_photo"; // Change this to your actual bucket

    public String uploadFile(MultipartFile file, String fileName) throws IOException {
        Storage storage = StorageOptions.getDefaultInstance().getService();

        // Create a BlobId for the object
        BlobId blobId = BlobId.of(BUCKET_NAME, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType()) // Dynamically set content type
                .build();

        // Upload file to GCS
        storage.create(blobInfo, file.getBytes());

        // Return the public URL of the uploaded file
        return "https://storage.googleapis.com/" + BUCKET_NAME + "/" + fileName;
    }
}
