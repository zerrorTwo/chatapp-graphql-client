import { gql } from "@apollo/client";

const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($file: Upload!) {
    uploadAvatar(file: $file)
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($dataUpdate: UpdateUserDto!) {
    updateUser(dataUpdate: $dataUpdate) {
      userName
      status
      avatarUrl
    }
  }
`;

export { UPLOAD_AVATAR, UPDATE_USER };
