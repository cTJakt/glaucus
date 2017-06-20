from keras.preprocessing.image import ImageDataGenerator


def trainGen(train_loc):
    train_datagen = ImageDataGenerator(
        rescale=1. / 255,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True)

    # this is a generator that will read pictures found in
    # subfolers of 'data/train', and indefinitely generate
    # batches of augmented image data
    train_generator = train_datagen.flow_from_directory(
        train_loc,  # this is the target directory
        target_size=(28, 28),
        batch_size=32)  # since we use binary_crossentropy loss, we need binary labels

    return train_generator


def testGen(test_loc):
    # this is the augmentation configuration we will use for testing:
    # only rescaling
    test_datagen = ImageDataGenerator(rescale=1. / 255)

    test_generator = test_datagen.flow_from_directory(test_loc,
                                                      target_size=(28, 28),
                                                      batch_size=32)
    return test_generator
