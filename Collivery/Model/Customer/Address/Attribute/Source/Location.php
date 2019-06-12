<?php

namespace MDS\Collivery\Model\Customer\Address\Attribute\Source;

use MDS\Collivery\Model\Connection;

class Location extends \Magento\Eav\Model\Entity\Attribute\Source\AbstractSource
{
    public $_collivery;

    public function __construct()
    {
        $connection = new Connection();
        $this->_collivery = $connection->getConnection();
    }

    public function getAllOptions($withEmpty = true, $defaultValues = false)
    {
        if (!$this->_options) {
            $this->_options = $this->getLocations();
        }

        return $this->_options;
    }

    public function getLocations()
    {
        $locations = $this->colliveryLocationTypes();

        foreach ($locations as $key => $location) {
            $locations_types[] =
                [
                    'value' => $key,
                    'label' => $location,
                ];
        }

        return $locations_types;
    }

    private function colliveryLocationTypes()
    {
        $locations = $this->_collivery->getLocationTypes();
        if (!$locations) {
            return false;
        }
        return $locations;
    }

    public static function getLocationById($id)
    {
        $locationTypes = (new Location())->colliveryLocationTypes();

        return $locationTypes[$id];
    }
}
