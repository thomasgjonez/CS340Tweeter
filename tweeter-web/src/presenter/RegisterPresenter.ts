import { UserService } from "../model.service/UserService";
import { Buffer } from "buffer";
import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
  setImageUrl?: (url: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  public imageBytes: Uint8Array = new Uint8Array();
  public imageFileExtension: string = "";
  public rememberMe: boolean = false;

  public isSubmitDisabled(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    imageFileExtension: string
  ): boolean {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ): Promise<void> {
    if (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !userImageBytes.length ||
      !imageFileExtension
    ) {
      this.view.displayErrorMessage("All fields and an image are required");
      return;
    }

    await this.doAuthenticate("register user", rememberMe, async () =>
      this.service.register(
        firstName,
        lastName,
        alias,
        password,
        userImageBytes,
        imageFileExtension
      )
    );
  }

  public handleImageFile(
    file: File | undefined,
    setImageUrl: (url: string) => void,
    setImageBytes: (bytes: Uint8Array) => void,
    setImageFileExtension: (ext: string) => void
  ): void {
    if (!file) {
      setImageUrl("");
      setImageBytes(new Uint8Array());
      return;
    }

    setImageUrl(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result as string;
      const base64Str = result.split("base64,")[1];
      setImageBytes(Uint8Array.from(Buffer.from(base64Str, "base64")));
    };
    reader.readAsDataURL(file);

    const extension = this.getFileExtension(file);
    if (extension) setImageFileExtension(extension);
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }
}

// const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     handleImageFile(file);
//   };

//   const handleImageFile = (file: File | undefined) => {
//     if (file) {
//       setImageUrl(URL.createObjectURL(file));

//       const reader = new FileReader();
//       reader.onload = (event: ProgressEvent<FileReader>) => {
//         const imageStringBase64 = event.target?.result as string;

//         // Remove unnecessary file metadata from the start of the string.
//         const imageStringBase64BufferContents =
//           imageStringBase64.split("base64,")[1];

//         const bytes: Uint8Array = Buffer.from(
//           imageStringBase64BufferContents,
//           "base64"
//         );

//         setImageBytes(bytes);
//       };
//       reader.readAsDataURL(file);

//       // Set image file extension (and move to a separate method)
//       const fileExtension = getFileExtension(file);
//       if (fileExtension) {
//         setImageFileExtension(fileExtension);
//       }
//     } else {
//       setImageUrl("");
//       setImageBytes(new Uint8Array());
//     }
//   };

//   const getFileExtension = (file: File): string | undefined => {
//     return file.name.split(".").pop();
//   };
